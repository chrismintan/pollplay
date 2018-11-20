import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
  root: {
    background: 'white',
    padding: 0,

  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  zero: {
    padding: 0,
    margin: 0,
  },
});

function PinnedSubheaderList(props) {
  const { classes } = props;

  return (
    <List className={classes.root}>
    <ListSubheader className={classes.zero}>
          Name
        </ListSubheader>
      <ListItem className={classes.ul}>

        <ListItemText className={classes.zero}>
          Hello
        </ListItemText>
      </ListItem>
    </List>
  );
}

export default withStyles(styles)(PinnedSubheaderList);