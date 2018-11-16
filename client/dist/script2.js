
window.onload = function(){

  if ( window.location.href.includes('rooms') ) {

    console.log('Animation Init!')

    // webgl renderer
    var gl;
    var shaderProgram;
    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();
    var eyeFrom = vec3.create();
    var eyeTo = vec3.create();
    var eyeVector = vec3.create();

    // webgl objects
    var cubeVertexPositionBuffer;
    var cubeVertexColorBuffer;
    var cubeVertexIndexBuffer;
    var cubeVertexData1Buffer;
    var cubeVertexData2Buffer;
    var lastTrackPositionUpdate = 0;
    var firstTime = 0;
    var globalTime = 0;
    var state = 'blank';
    var stateStart = 0;

    // player state
    var artistName = '';
    var albumImageURL = '';
    var albumName = '';
    var albumURI = '';
    var visibleAlbumURI = '';
    var nextVectorData = null;
    var trackDuration = 180000;
    var trackURI = '';
    var trackPosition = 0;
    var trackPlaying = false;
    var trackName = '';

    // misc ui
    var closetimer = 0;


    function updateStatus() {
      let data = (document.cookie.split('; ').reduce(function(result, v, i, a) { var k = v.split('='); result[k[0]] = k[1]; return result; }, {}))

      albumURI = decodeURIComponent(data.albumURI)
      albumImageURL = decodeURIComponent(data.albumImageURL)
      trackName = decodeURIComponent(data.trackName)
      albumName = decodeURIComponent(data.albumName)
      artistName = decodeURIComponent(data.artistName)
      trackPosition = decodeURIComponent(data.trackPosition)
      trackDuration = decodeURIComponent(data.trackDuration)
      trackPlaying = decodeURIComponent(data.trackPlaying)
      trackURI = decodeURIComponent(data.trackURI)
      setNowPlayingTrack(trackURI)

      var w = (trackPosition * 100) / trackDuration;
      w = Math.max(Math.min(100, w), 0);
      document.getElementById('trackposition').style.display = 'block';
      document.getElementById('trackpositionfill').style.width = w + '%';

      if ( artistName != '' && trackName != undefined ){
        toast(artistName, trackName);
        setTimeout(function(){
          document.getElementById('toast').className = 'toast visible';
        }, 5000)
      }

    }

    setInterval(function(){updateStatus()}, 3000);

    // --------------------------------------------------------------------------------------
    // Some polyfills
    // --------------------------------------------------------------------------------------

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function(callback) {
               window.setTimeout(callback, 1000/60);
             };
    })();



    // --------------------------------------------------------------------------------------
    // Network code
    // --------------------------------------------------------------------------------------

    function createRequest(method, url, onload) {
      var request = new XMLHttpRequest();
      request.open(method, url);
      if (method != 'GET') {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      }
      request.onerror = function () {};
      request.onload = onload.bind(this, request);
      return request;
    }

    function requestFile(filename, callback) {
      createRequest('GET', filename, function(request) {
        if (request.status >= 200 && request.status < 400) {
          callback(request.responseText);
        }
      }).send();
    }

    function createAuthorizedRequest(method, url, onload) {
      var request = createRequest(method, url, onload);
      request.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      return request;
    }

    function _pollCurrentlyPlaying(callback) {
      createAuthorizedRequest(
        'GET',
        'https://api.spotify.com/v1/me/player/currently-playing',
        function(request) {
          if (request.status < 200 || request.status >= 400) {
            callback();
            return;
          }

          var data = JSON.parse(request.responseText);
          console.log('got data', data);
          if (data.item) {
            albumURI = data.item.album.uri;
            albumImageURL = data.item.album.images[0].url;
            trackName = data.item.name;
            albumName = data.item.album.name;
            artistName = data.item.artists[0].name;
            setNowPlayingTrack(data.item.uri);
            trackPosition = data.progress_ms;
            trackDuration = data.item.duration_ms;
            trackPlaying = data.is_playing
          }
          callback();
        }
      ).send();
    }

    var pollDebounce = 0;
    function pollCurrentlyPlaying(delay) {
      if (pollDebounce) {
        clearTimeout(pollDebounce);
      }
      pollDebounce = setTimeout(
          _pollCurrentlyPlaying.bind(this, pollCurrentlyPlaying.bind(this)),
          delay || 5000);
    }

    function getUserInformation(callback) {
      createAuthorizedRequest('GET', 'https://api.spotify.com/v1/me', function(request) {
        if (request.status < 200 || request.status >= 400) {
          callback(null);
          return;
        }

        console.log('got data', request.responseText);
        var data = JSON.parse(request.responseText);
        callback(data);
      }).send();
    }

    function sendPlayCommand(payload) {
      createAuthorizedRequest('PUT', 'https://api.spotify.com/v1/me/player/play', function(request) {
        if (request.status >= 200 && request.status < 400) {
          console.log('play command response', request.responseText);
        }
        pollCurrentlyPlaying(1500);
      }).send(JSON.stringify(payload));
    }

    function sendCommand(method, command, querystring) {
      console.log('COMMAND: ' + command);
      var url = 'https://api.spotify.com/v1/me/player/' + command + (querystring ? ('?' + querystring) : '');
      createAuthorizedRequest(method, url, function (request) {
        if (request.status >= 200 && request.status < 400) {
          console.log('commant response', request.responseText);
        }
        pollCurrentlyPlaying(1500);
      }).send();
    }

    function fetchVectors(albumimage, callback) {
      createRequest('POST', 'https://ilovepolygons.possan.se/convert', function (request) {
        if (request.status >= 200 && request.status < 400) {
          nextVectorData = JSON.parse(request.responseText);
          callback();
        }
      }).send('url=' + encodeURIComponent(albumimage) + '&cutoff=10000&threshold=20');
    }

    function sendPlayContext(uri, offset) {
      sendPlayCommand({
        context_uri: uri,
        offset: {
          position: offset || 0
        }
      });
    }



    // --------------------------------------------------------------------------------------
    // WebGL Rendering code
    // --------------------------------------------------------------------------------------

    function initWebGL(canvas) {
      try {
        gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
      } catch (e) {}

      if (!gl) {
        // alert("Could not initialise WebGL, sorry :-( *sad panda*");
        setTimeout(function() {
          initAnimation();
        }, 2000)
      }

      var downsample = 1; // reduce rendering quality

      function fit() {
        var w = document.body.offsetWidth;
        var h = document.body.offsetHeight;
        canvas.width = Math.floor(w / downsample);
        canvas.height = Math.floor(h / downsample);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
      }

      // window.addEventListener('resize', function (r) {
      //   console.log('window resized.');
      //   fit();
      // });

      fit();
    }

    function initWebGLShaders() {
      shaderProgram = gl.createProgram();
      requestFile('https://raw.githubusercontent.com/possan/webgl-spotify-connect-now-playing-screen-example/master/shader.vs', function (vscode) {
        requestFile('https://raw.githubusercontent.com/possan/webgl-spotify-connect-now-playing-screen-example/master/shader.fs', function (fscode) {
          var fragmentShader;
          var vertexShader;

          fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          vertexShader = gl.createShader(gl.VERTEX_SHADER);

          gl.shaderSource(fragmentShader, fscode);
          gl.compileShader(fragmentShader);
          if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Compilation error: ', gl.getShaderInfoLog(fragmentShader));
          }

          gl.shaderSource(vertexShader, vscode);
          gl.compileShader(vertexShader);
          if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Compilation error: ', gl.getShaderInfoLog(vertexShader));
          }

          gl.attachShader(shaderProgram, vertexShader);
          gl.attachShader(shaderProgram, fragmentShader);
          gl.linkProgram(shaderProgram);

          if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
          }

          gl.useProgram(shaderProgram);

          shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
          gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

          shaderProgram.vertexData1Attribute = gl.getAttribLocation(shaderProgram, "aVertexData1");
          gl.enableVertexAttribArray(shaderProgram.vertexData1Attribute);

          shaderProgram.vertexData2Attribute = gl.getAttribLocation(shaderProgram, "aVertexData2");
          gl.enableVertexAttribArray(shaderProgram.vertexData2Attribute);

          shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
          gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

          shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
          shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
          shaderProgram.pMatrixUniform2 = gl.getUniformLocation(shaderProgram, "uPMatrix2");
          shaderProgram.mvMatrixUniform2 = gl.getUniformLocation(shaderProgram, "uMVMatrix2");

          shaderProgram.eyeVector = gl.getUniformLocation(shaderProgram, "eyeVector");

          shaderProgram.timeUniform = gl.getUniformLocation(shaderProgram, "time");
          shaderProgram.progressUniform = gl.getUniformLocation(shaderProgram, "progress");
          shaderProgram.wobble1Uniform = gl.getUniformLocation(shaderProgram, "wobble1");
          shaderProgram.wobble2Uniform = gl.getUniformLocation(shaderProgram, "wobble2");
        });
      });
    }

    function setMatrixUniforms() {
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform2, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform2, false, mvMatrix);
      gl.uniform3f(shaderProgram.eyeVector, false, eyeVector[0], eyeVector[1], eyeVector[2]);
    }

    function initWebGLBuffers() {
      cubeVertexPositionBuffer = gl.createBuffer();
      cubeVertexColorBuffer = gl.createBuffer();
      cubeVertexIndexBuffer = gl.createBuffer();
      cubeVertexData1Buffer = gl.createBuffer();
      cubeVertexData2Buffer = gl.createBuffer();
    }

    function updateBuffers(vectordata) {
      var vertices = [];
      var colors = [];
      var cubeVertexIndices = [];
      var verticesdata2 = [];
      var verticesdata3 = [];

      function addFace(x0, y0, x1, y1, x2, y2, r, g, b) {
        var xc = (x0 + x1 + x2) / 3.0;
        var yc = (y0 + y1 + y2) / 3.0;

        var R = 0.0;
        R += xc * 4.0;
        R += -0.05 + Math.random() * 0.1;
        R += r - b;

        var dx = (0.0 - xc);
        var dy = (0.0 - yc);
        var d = Math.sqrt(dx * dx + dy * dy);
        var br = 1.0; // Math.max(0.0, d);

        var rx = -1.0 + Math.random() * 2.0;
        var ry = d * 0.2 + -1.0 + Math.random() * 2.0;
        var rz = d * d; // -1.0 + Math.random() * 2.0;

        // X, Y, 0
        vertices.push(x0);
        vertices.push(y0);
        vertices.push(0.0);

        vertices.push(x1);
        vertices.push(y1);
        vertices.push(0.0);

        vertices.push(x2);
        vertices.push(y2);
        vertices.push(0.0);

        // R, G, B, A
        colors.push(r * br);
        colors.push(g * br);
        colors.push(b * br);
        colors.push(1.0);

        colors.push(r * br);
        colors.push(g * br);
        colors.push(b * br);
        colors.push(1.0);

        colors.push(r * br);
        colors.push(g * br);
        colors.push(b * br);
        colors.push(1.0);

        // Face 1
        cubeVertexIndices.push(cubeVertexIndices.length);
        cubeVertexIndices.push(cubeVertexIndices.length);
        cubeVertexIndices.push(cubeVertexIndices.length);

        // RANDOMINDEX);  PIVOT_X);  PIVOT_Y
        verticesdata2.push(R);
        verticesdata2.push(xc);
        verticesdata2.push(yc);
        verticesdata2.push(0.0);

        verticesdata2.push(R);
        verticesdata2.push(xc);
        verticesdata2.push(yc);
        verticesdata2.push(0.0);

        verticesdata2.push(R);
        verticesdata2.push(xc);
        verticesdata2.push(yc);
        verticesdata2.push(0.0);

        // RANDOMINDEX); PIVOT_X); PIVOT_Y
        verticesdata3.push(rx);
        verticesdata3.push(ry);
        verticesdata3.push(rz);
        verticesdata3.push(0.0);

        verticesdata3.push(rx);
        verticesdata3.push(ry);
        verticesdata3.push(rz);
        verticesdata3.push(0.0);

        verticesdata3.push(rx);
        verticesdata3.push(ry);
        verticesdata3.push(rz);
        verticesdata3.push(0.0);
      }

      if (vectordata) {
        var scale = 1.0 / vectordata.height;
        var xoffset = vectordata.width / 2;
        var yoffset = vectordata.height / 2;
        for (var i = 0; i < vectordata.tris.length; i++) {
          var x = vectordata.tris[i];
          addFace(-((x.x0 + xoffset) * scale - 1.0), -((x.y0 + yoffset) * scale - 1.0), -((x.x1 + xoffset) * scale - 1.0), -((x.y1 + yoffset) * scale - 1.0), -((x.x2 + xoffset) * scale - 1.0), -((x.y2 + yoffset) * scale - 1.0),
                  x.r / 255.0, x.g / 255.0, x.b / 255.0);
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      cubeVertexPositionBuffer.itemSize = 3;
      cubeVertexPositionBuffer.numItems = vertices.length / 4;

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      cubeVertexColorBuffer.itemSize = 4;
      cubeVertexColorBuffer.numItems = colors.length / 4;

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
      cubeVertexIndexBuffer.itemSize = 3;
      cubeVertexIndexBuffer.numItems = cubeVertexIndices.length;

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexData1Buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesdata2), gl.STATIC_DRAW);
      cubeVertexData1Buffer.itemSize = 4;
      cubeVertexData1Buffer.numItems = verticesdata2.length / 4;

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexData2Buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesdata3), gl.STATIC_DRAW);
      cubeVertexData2Buffer.itemSize = 4;
      cubeVertexData2Buffer.numItems = verticesdata3.length / 4;
    }

    function drawScene() {
      gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var fov = 50;
      mat4.perspective(fov, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

      eyeFrom = [
        0.0 + 0.3 * Math.sin(globalTime / 1950),
        0.0 + 0.3 * Math.cos(globalTime / 1730),
        0.0 + 0.4 * Math.cos(globalTime / 1463) - 0.75
      ];

      eyeTo = [
        0.0 + 0.1 * Math.sin(globalTime / 2250),
        0.0 + 0.1 * Math.cos(globalTime / 1730),
        0.0 + 0.1 * Math.cos(globalTime / 1963) + 0.0
      ];

      vec3.subtract(eyeTo, eyeFrom, eyeVector);
      vec3.normalize(eyeVector);

      mat4.lookAt(eyeFrom, eyeTo, [
        0.0 + 0.1 * Math.sin(globalTime / 3650),
        1.0,
        0.0 + 0.1 * Math.cos(globalTime / 2650)
      ], mvMatrix);

      setMatrixUniforms();

      if (cubeVertexPositionBuffer && cubeVertexPositionBuffer.numItems > 0) {

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexData1Buffer);
        gl.vertexAttribPointer(shaderProgram.vertexData1Attribute, cubeVertexData1Buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexData2Buffer);
        gl.vertexAttribPointer(shaderProgram.vertexData2Attribute, cubeVertexData2Buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      }
    }

    function tick() {
      requestAnimFrame(tick);
      gl.uniform1f(shaderProgram.timeUniform, globalTime);

      var progress = -2.0;
      var stateTime = 0;

      if (state == 'blank') {
        progress = -2.0;
        if (albumURI != visibleAlbumURI) {
          console.log('Album URI changed: ' + albumURI);
          visibleAlbumURI = albumURI;
          console.log('Got album image..');
          fetchVectors(albumImageURL, function () {
            console.log('Got album vectors..');
            updateBuffers(nextVectorData);
            nextVectorData = null;
            state = 'fadein';
            stateTime = 0.0;
            stateStart = globalTime;
          });
        }
      } else if (state == 'fadein') {
        stateTime = globalTime - stateStart;
        progress = -2.0 + stateTime / 7000.0;
        if (stateTime > 14000.0) {
          console.log('Fade in done.');
          state = 'visible';
          stateTime = 0.0;
          stateStart = globalTime;
        }
      } else if (state == 'visible') {
        progress = 0.0;
        if (albumURI != visibleAlbumURI) {
          console.log('Fading out...');
          state = 'fadeout';
          stateTime = 0.0;
          stateStart = globalTime;
        }
      } else if (state == 'fadeout') {
        stateTime = globalTime - stateStart;
        progress = 0.0 + stateTime / 2500.0;
        if (stateTime > 5000.0) {
          console.log('Faded out.');
          state = 'blank';
          stateTime = 0.0;
          stateStart = globalTime;
        }
      }

      var t2 = Math.sin(globalTime / 1000.0) * Math.max(0, Math.sin(globalTime / 4600.0));
      var t3 = Math.cos(globalTime / 1300.0) * Math.max(0, Math.cos(globalTime / 5400.0));

      gl.uniform1f(shaderProgram.progressUniform, progress);
      gl.uniform1f(shaderProgram.wobble1Uniform, t2);
      gl.uniform1f(shaderProgram.wobble2Uniform, t3);

      drawScene();

      var timeNow = new Date().getTime();
      if (firstTime == 0) {
        firstTime = timeNow;
      }
      globalTime = timeNow - firstTime;
    }




    // --------------------------------------------------------------------------------------
    // DOM UI
    // --------------------------------------------------------------------------------------



    function hideLogin() {
      document.getElementById('biglogin').style.display = 'none';
    }

    function showLogin() {
      document.getElementById('biglogin').style.display = 'block';
    }

    function toast(title, subtitle) {
      document.getElementById('text').innerText = title || '';
      document.getElementById('text2').innerText = subtitle || '';


      // clearTimeout(closetimer);
      // closetimer = setTimeout(function () {
      //   document.getElementById('toast').className = 'toast';
      // }, 5000);
    }

    function setNowPlayingTrack(uri) {
      if (uri == trackURI) {
        return;
      }

      trackURI = uri;
      toast(trackName, artistName + ' - ' + albumName);
    }

    function initUI() {
      document.getElementById('trackposition').addEventListener('mousedown', function(event) {
        var time = event.offsetX * trackDuration / document.body.offsetWidth;
        trackPosition = time;
        sendCommand('PUT', 'seek', 'position_ms='+Math.round(time));
      });
    }

    // --------------------------------------------------------------------------------------
    // Bootstrapping
    // --------------------------------------------------------------------------------------

    function initAnimation() {
      initWebGL(document.getElementById("canvas"));
      initWebGLBuffers();
      initWebGLShaders();
      initUI();
      tick();
    }

  initAnimation();


  }
}








