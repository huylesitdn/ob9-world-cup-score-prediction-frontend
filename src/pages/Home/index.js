import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { get, range } from 'lodash';
import qs from "qs";
import moment from "moment";


import { BACKEND_URL } from 'utils/constants'

import { getLastMatches } from "apis/index"
import './index.scss'

const Home = () => {
  const { t, i18n } = useTranslation();
  const params = useParams()
  const slug = get(params, 'slug');

  const [match, setMatch] = useState();
  const [loading, setLoading] = useState(true);
  const [formValue, setFormValue] = useState({
    team_score_1: "",
    team_score_2: "",
    user_name: ""
  });

  useEffect(()=> {
    i18n && i18n.language && getInitialData();
  }, [i18n, i18n.language])


  const getInitialData = () => {
    setLoading(true);
    
    const locale = i18n.language.split('-')[0]
    const query = qs.stringify({
      populate: 'deep',
      locale: locale,
      filters: {
        slug: {
          $eq: slug,
        },
      },
      pagination: {
        limit: 1
      },
      sort: ['createdAt:desc'],
    }, {
      encodeValuesOnly: true, // prettify URL
    });
    

    getLastMatches(query).then(res => {
      setLoading(false);
      setMatch(get(res, 'data.data[0]'))
    })
  }

  const renderNotFound = () => {
    return "Not Found Match"
  }

  const renderLoading = () => {
    return "Loading ...."
  }

  const handleFormChange = (e) => {
    const _name = e.target.name;
    const _value = e.target.value;
    setFormValue({
      ...formValue,
      [_name]: _value
    })
    console.log(e)
  }

  const renderMatch = () => {
    console.log(match)
    const bg_url = `${BACKEND_URL}${get(match, 'attributes.bg.data.attributes.url')}`;
    const team_avatar_img_url = `${BACKEND_URL}${get(match, 'attributes.avatar.data.attributes.url')}`;
    const title = get(match, 'attributes.title');
    const subtitle = get(match, 'attributes.subtitle');
    const match_time = moment(get(match, 'attributes.date')).locale(i18n.language).format('DD MMMM YYYY, HH:mm [GMT] Z');
    const team_1_url = `${BACKEND_URL}${get(match, 'attributes.football_team_1.data.attributes.logo.data.attributes.url')}`;
    const team_1_name = get(match, 'attributes.football_team_1.data.attributes.name');
    const team_2_url = `${BACKEND_URL}${get(match, 'attributes.football_team_2.data.attributes.logo.data.attributes.url')}`;
    const team_2_name = get(match, 'attributes.football_team_2.data.attributes.name');


    return (
      <div className="home-page" style={{backgroundImage: `url(${bg_url})`}}>
        <div className="container">
          <h2 className="title">{title}</h2>
          <div className="row">
            <div className="col-md-7 col-12 avatar-section">
              <img className="avatar-section__avatar" src={team_avatar_img_url} alt="" />
              <div className="avatar-section__subtitle" dangerouslySetInnerHTML={{__html: subtitle}} />
            </div>
            <div className="col-md-5 col-12 match-section">
              <div className="match-section__item">
                <div className="match-section__item__title" dangerouslySetInnerHTML={{__html: t('PREMIER_LEAGUE_GAME_WEEK_15')}} />
                <div className="match-section__item__time">{match_time}</div>
                <form className="match-section__item__form">
                  <div className="match-section__item__form__teams">
                    <div className="match-section__item__form__teams__team">
                      <img className="match-section__item__form__teams__team__logo" src={team_1_url} alt={team_1_name} />
                      <div className="match-section__item__form__teams__team__name">{team_1_name}</div>
                      <select className="form-select w-auto match-section__item__form__teams__team__select" name="team_score_1" value={formValue.team_score_1} onChange={handleFormChange}>
                        <option>?</option>
                        {range(1, 11).map((i) => <option value={i}>{i}</option>)}
                      </select>
                      <div className="match-section__item__form__teams__team__help-text">{t('prediction_here')}</div>
                    </div>
                    <div className="match-section__item__form__teams__vs">{t('VS')}</div>
                    <div className="match-section__item__form__teams__team">
                      <img className="match-section__item__form__teams__team__logo" src={team_2_url} alt={team_2_name} />
                      <div className="match-section__item__form__teams__team__name">{team_2_name}</div>
                      <select className="form-select w-auto match-section__item__form__teams__team__select" name="team_score_2" value={formValue.team_score_2} onChange={handleFormChange}>
                        <option>?</option>
                        {range(1, 11).map((i) => <option value={i}>{i}</option>)}
                      </select>
                      <div className="match-section__item__form__teams__team__help-text">{t('prediction_here')}</div>
                    </div>
                  </div>
                  <div className="match-section__item__form__username">
                    <a href="#" target="_blank" className="btn btn-link terms-link">{t('Terms_Conditions')}</a>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder={t('username')} name="user_name" value={formValue.user_name} onChange={handleFormChange} />
                      <button className="btn btn-warning" type="button" id="button-addon2">{t('Submit')}</button>
                    </div>
                  </div>
                  <div className="match-section__item__form__action">
                    <div>
                      <a href="#" target="_blank" className="btn btn-link">{t('Not_yet_a_member')}</a>
                    </div>
                    <button type="submit" className="btn btn-warning">{t('sign_up_here')}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-7 col-12">ADS Left</div>
            <div className="col-md-5 col-12">ADS Right</div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (!loading && !match) ? renderNotFound() : renderMatch()
  }

  return (
    <div className="home-page">
      {loading ? renderLoading() : renderContent()}
    </div>
  );
}

export default Home;
