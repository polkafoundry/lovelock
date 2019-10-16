import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    cursor: 'pointer',
    '&:hover': {
      color: '#000'
    }
  },
	icon: {
		margin: '0 10px',
	}
}));

export default function MemoryTitle(props) {
	const classes = useStyles();
  return (
    <>
      <span className={classes.wrapper} onClick={props.handleClose}>
        { props.sender == props.receiver ? (
          <>{`${props.sender} 's Journal`}</>
        ) : (
          <>
          {props.sender}
          <img className={classes.icon} src="/static/img/logo.svg" width="20"/>
          {props.receiver}
          </>
        )}
        
      </span>
      <span> / Blog</span>
    </>
  )
}