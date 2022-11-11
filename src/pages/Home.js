import { useTranslation } from 'react-i18next';


function Home() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="home">
      <button type="button" onClick={() => changeLanguage('zh')}>
          zh
        </button>
        <button type="button" onClick={() => changeLanguage('en')}>
          en
        </button>
      Home page {t('test')}
    </div>
  );
}

export default Home;
