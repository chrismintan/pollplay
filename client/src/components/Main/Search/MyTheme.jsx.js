import { createMuiTheme } from '@material-ui/core/styles'

import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

const MyTheme = createMuiTheme({
    overrides:{
        MuiInput: {
          color: 'white',
            underline: {
                 '&:after': {
                    borderBottom: '2px solid #fff',
                  },
                  "&:after": {
                    borderBottom: '2px solid #fff',
                  }
              },
        },
    }
});

export default MyTheme;