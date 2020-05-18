import React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
// import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'

const styles = createStyles({
  root: {
    width: 250
  },
  input: {
    width: 42
  }
})

interface Props extends WithStyles<typeof styles> {
  min: number
  max: number
  step: number
  label: string
}
interface State {
  value: number
}
class InputSlider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { value: 0 }
  }

  setValue = (value: number) => {
    this.setState({ value })
  }

  handleSliderChange = (event: any, newValue: number) => {
    this.setValue(newValue)
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setValue(Number(event.target.value))
  }

  handleBlur = () => {
    if (this.state.value < 0) {
      this.setValue(0)
    } else if (this.state.value > 16) {
      this.setValue(16)
    }
  }

  render() {
    const { label, classes, min, max, step } = this.props
    const { value } = this.state
    return (
      <div className={classes.root}>
        <Typography id="input-slider" gutterBottom>
          {label}
        </Typography>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs>
              {/*
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={this.handleSliderChange}
              marks
              min={min}
              max={max}
              step={step}
              aria-labelledby="input-slider"
            />
                */}
          </Grid>
          <Grid item>
            <Input
              className={classes.input}
              value={value}
              margin="dense"
              onChange={this.handleInputChange}
              onBlur={this.handleBlur}
              inputProps={{
                step,
                min,
                max,
                type: 'number',
                'aria-labelledby': 'input-slider'
              }}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(InputSlider)
