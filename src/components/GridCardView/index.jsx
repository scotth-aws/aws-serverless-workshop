import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import logo from '../App/video.jpg';

const GridCardView = (props) => {
  const { item: { title, description } } = props;
  return (
    <div className="card">
      <div className="container">
        <img src={logo} alt="Movie" />
        <h5>{title}</h5>
        <h6>{description.substring(0,80)}</h6>
      </div>
      
    </div>
  );
};

GridCardView.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

GridCardView.defaultProps = {
  item: {
    title: 'Default Title',
    description: 'Default Details',
  },
};

export default GridCardView;
