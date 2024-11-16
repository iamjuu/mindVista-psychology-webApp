import Navbar from '../../navbar'
import Footer from '../../footer'
import Bgsection from './sections/sectionBg'
import SectionOne from './sections/sectionOne'
import SectionTwo from './sections/sectiontwo'
import SectionThree from './sections/sectionThree'
const index = () => {
  return (
    <> 
    <Navbar/>
      <Bgsection/>
      <SectionOne/>
      <SectionTwo/>
      <SectionThree/>
      <Footer/>
    </>
  );
}
export default index;
