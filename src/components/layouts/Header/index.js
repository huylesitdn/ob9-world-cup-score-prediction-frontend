import { useState } from "react";
import { useTranslation } from "react-i18next";

import logo from 'assets/images/Aston-Villa/1.png';
import logoZH from 'assets/images/Aston-Villa/1.png';

import './index.scss';

function Header() {
  const [locales] = useState(window.__AVAILABLE_LOCALES__ || []);

  const { i18n } = useTranslation();

  const handleLangaugeChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="navbar navbar-custom">
      <div className="container-fluid">
        <img src={i18n.language === 'en' ? logo : logoZH} alt="" />
        <select className="form-select w-auto form-select-sm" value={i18n.language} onChange={handleLangaugeChange}>
        {locales.map(({ name, code }) => (
          <option value={code} key={code}>
            {name}
          </option>
        ))}
      </select>
      </div>
    </nav>
  );
}

export default Header;
