import Navbar from '../../navbar'
import Footer from '../../footer'
import Bgsection from './sections/sectionBg'
import SectionOne from './sections/sectionOne'
import SectionTwo from './sections/sectiontwo'
const index = () => {
  return (
    <> 
    <Navbar/>
      <Bgsection/>
      <SectionOne/>
      <SectionTwo/>
      <Footer/>
    </>
  );
}
export default index;
