import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './style';

const Index = ({ btnName = "Button", width, fontsize, color ,border ,bg,onClick}) => {
  return (
    <Button onClick={onClick} fontsize={fontsize} border={border} color={color} bg={bg} width={width}> 
      {btnName}
    </Button>
  );
}

export const IconBtn = ({ onClick, Icon, label = 'Logout', className = '' }) => {
  let iconNode = null;
  if (Icon) {
    if (typeof Icon === 'function') {
      iconNode = <Icon className="w-4 h-4" />;
    } else if (React.isValidElement(Icon)) {
      const mergedClassName = `w-4 h-4 ${Icon.props?.className || ''}`.trim();
      iconNode = React.cloneElement(Icon, { className: mergedClassName });
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors ${className}`}
    >
      {iconNode}
      {label}
    </button>
  );
}

Index.propTypes = {
  btnName: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontsize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  border: PropTypes.string,
  bg: PropTypes.string,
  onClick: PropTypes.func,
};

IconBtn.propTypes = {
  onClick: PropTypes.func,
  Icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Index;