import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { withSize } from 'react-sizeme';


class PopoverProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      width: 350,
      height: 350,
    };
  }

  componentDidMount(username) {

    console.log('componentDidMount width', this.props.size.width);
    this.setState({ width: this.props.size.width, height: this.props.size.height})

  }

  static getDerivedStateFromProps(props, state) {
    const { progress } = props;
    const newState = state;
    //console.log('getDerivedStateFromProps '+JSON.stringify(props));
    if (progress > 0 && progress < 100) {
      newState.showing = true;
    }
    return newState;
  }

  hideProgress = () => {
    this.setState({
      showing: false,
    });
  }

  progressInfo = () => {
    const { progress } = this.props;
    //console.log('progressInfo '+JSON.stringify(this.props));
    let returnValue = (
      <div>
        Error!
      </div>
    );
    if (progress >= 100 || progress <= 0) {
      returnValue = (
        <div>
          Upload Complete!
        </div>
      );
    } else if (progress > 0) {
      returnValue = (<ProgressBar now={progress} />);
    }
    return returnValue;
  }

  overlayProgress = () => {
    const { showing } = this.state;
   
    return (
      <div>
      <Modal id="popup" style={{ maxWidth: this.state.width }} isOpen={showing} toggle={this.hideProgress}>
        <ModalHeader toggle={this.hideProgress}>Upload Progress</ModalHeader>
        <ModalBody>
          {this.progressInfo()}
        </ModalBody>
      </Modal>
      </div>
    );
    
  }

  render() {
    return (
      <div>
        {this.overlayProgress()}
        </div>
      
    );
  }
}

PopoverProgress.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default withSize({ monitorHeight: true, refreshRate: 25 })(PopoverProgress);
