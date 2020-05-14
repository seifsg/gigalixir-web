import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { goBack, RouterAction } from 'react-router-redux'

interface Props {
  myGoBack: () => RouterAction
}

class BackButton extends Component<Props> {
  public handleClick = () => {
    const { myGoBack } = this.props
    myGoBack()
  }

  public render() {
    return (
      <Button variant="contained" color="primary" onClick={this.handleClick}>
        &#129040;
      </Button>
    )
  }
}

export default connect(null, {
  myGoBack: goBack
})(BackButton)
