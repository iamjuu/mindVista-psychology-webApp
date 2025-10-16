import PropTypes from 'prop-types';
import { useTheme } from '../../../contexts/ThemeContext';

export const CardHeader = ({ title, description,icon }) => {
    const { themeClasses } = useTheme();
    return (

        <div className="mb-8 flex gap-3 ">
            <div className='flex items-center'>
                {icon}
            </div>
            <div>

        <h2 className={`text-[14px] font-bold ${themeClasses.text}`}>{title}</h2>
        <p className={`${themeClasses.textSecondary} text-[14px] font-[400]`}>{description}</p>
            </div>
      </div>
    )

}

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export const PageHeader = ({ title, description,titleclassName,desclassName }) => {
    const { themeClasses } = useTheme();
    return (
        <div className=" mb-8 ">
        <h2 className={` ${titleclassName} text-[16px] font-bold ${themeClasses.text}`}>{title}</h2>
        <p className={`${desclassName} ${themeClasses.textSecondary} text-[14px] font-[400]`} >{description}</p>
      </div>
    )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
