import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    display: 'flex',
    height: 'auto',
    alignItems: 'center',
    border: '1px solid transparent',
    borderRadius: 0,
    background: '#383838',
    '&:hover': {
      background: 'black',
    },
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  artist: {
    fontSize: 12,
    color: '#FEFEFEFF',
  },
  title: {
    fontSize: 17,
    color: 'white',
  },
});

function MediaControlCard(props) {
  const { classes, theme } = props;

  return (
    <Card className={classes.card}>
      <CardMedia  className={classes.cover}
                  image={props.image}
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.title}>
            {props.title}
          </Typography>
          <Typography className={classes.artist}>
            {props.artist}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}

MediaControlCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MediaControlCard);