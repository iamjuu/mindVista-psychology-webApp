import PropTypes from 'prop-types';

export const CardHeader = ({ title, description,icon }) => {
    return (

        <div className="mb-8 flex gap-3 ">
            <div className='flex items-center'>
                {icon}
            </div>
            <div>

        <h2 className="text-[14px] font-bold text-gray-900 ">{title}</h2>
        <p className="text-gray-600 text-[14px] font-[400]">{description}</p>
            </div>
      </div>
    )

}

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export const PageHeader = ({ title, description }) => {
    return (
        <div className="mb-8">
        <h2 className="text-[16px] font-bold text-gray-900 ">{title}</h2>
        <p className="text-gray-600 text-[14px] font-[400]">{description}</p>
      </div>
    )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
