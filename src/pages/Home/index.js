import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { get } from 'lodash';
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

  useEffect(()=> {
    i18n && i18n.language && getInitialData();
  }, [i18n, i18n.language])


  const getInitialData = () => {
    const query = qs.stringify({
      populate: 'deep',
      locale: i18n.language,
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
                      <img src={team_1_url} alt={team_1_name} />
                      <div>{team_1_name}</div>
                      <select className="form-select w-auto" name="team_score_1">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                    <div className="match-section__item__form__teams__vs">{t('VS')}</div>
                    <div className="match-section__item__form__teams__team">
                      <img src={team_2_url} alt={team_2_name} />
                      <div>{team_2_name}</div>
                      <select className="form-select w-auto" name="team_score_2">
                        <option selected>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                  </div>
                  <div className="match-section__item__form__username">
                    <a href="#" target="_blank" class="btn btn-link">{t('Terms_Conditions')}</a>
                    <div class="input-group">
                      <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2" name="user_name" />
                      <button class="btn btn-outline-secondary" type="button" id="button-addon2">{t('Submit')}</button>
                    </div>
                  </div>
                  <div className="match-section__item__form__action">
                    <div>
                      <a href="#" target="_blank" class="btn btn-link">{t('Not_yet_a_member')}</a>
                    </div>
                    <button type="submit" class="btn btn-warning">{t('sign_up_here')}</button>
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
