import { useTranslation } from "react-i18next";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import social from 'assets/images/Aston-Villa/13.png';
import team from 'assets/images/Aston-Villa/14.png';
import teamZH from 'assets/images/Aston-Villa/14.png';
import './index.scss'

function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <div className="footer">
      <div className="container">
        <div className="team-logo row justify-content-between align-items-center">
          <div className="col-md-6 col-12">
            <LazyLoadImage className="team-img" src={i18n.language === 'en' ? team : teamZH} alt ="" />
          </div>
          <div className="col-md-6 col-12 text-end">
            <LazyLoadImage className="social-img" src={social} alt ="" />
          </div>
        </div>
      </div>
      <div className="copyright">{t('copyright')}</div>
    </div>
  );
}

export default Footer;
