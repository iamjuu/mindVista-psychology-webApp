import Navbar from '../../navbar'
import Footer from '../../footer'
import Bgsection from './sections/sectionBg'
import SectionOne from './sections/sectionOne'
import SectionTwo from './sections/sectiontwo'
import SectionThree from './sections/sectionThree'
import SectionFour from './sections/sectionFour'
const index = () => {
  return (
    <> 
    <Navbar/>
      <Bgsection/>
      <SectionOne/>
      <SectionTwo/>
      <SectionThree/>
      <SectionFour/>
      <Footer/>
    </>
  );
}
export default index;
