import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { get, range, find } from 'lodash';
import qs from "qs";
import moment from "moment";
import { LazyLoadImage } from 'react-lazy-load-image-component';


import { BACKEND_URL } from 'utils/constants'

import SuccessModal from 'components/success-modal'

import { getLastMatches, createPredictionChallenges } from "apis/index"
import './index.scss'

const Home = () => {
  const { t, i18n } = useTranslation();
  const params = useParams()
  const slug = get(params, 'slug');

  const [match, setMatch] = useState();
  const [matchs, setMatchs] = useState();
  const [loading, setLoading] = useState(true);
  const [formValue, setFormValue] = useState({
    team_score_1: "",
    team_score_2: "",
    user_name: ""
  });
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Not Found Match");

  useEffect(()=> {
    i18n && i18n.language && getInitialData();
  }, [i18n, i18n.language, slug])


  const getInitialData = () => {
    setLoading(true);
    
    const locale = i18n.language.split('-')[0]
    const query = qs.stringify({
      populate: 'deep',
      locale: locale,
      // filters: {
      //   slug: {
      //     $eq: slug,
      //   },
      // },
      // pagination: {
      //   limit: 1
      // },
      sort: ['createdAt:desc'],
    }, {
      encodeValuesOnly: true, // prettify URL
    });
    

    getLastMatches(query).then(res => {
      setLoading(false);
      console.log(res)
      if(res.status === 200) {
        const _datas = get(res, 'data.data', [])
        const select_match = slug ? find(_datas, o => o.attributes.slug === slug) : _datas[0];
        setMatch(select_match)
        setMatchs(_datas)
      } else {
        setErrorMsg(`${res.status} - ${get(res, 'data.error.message')}`)
      }
    })
  }

  const renderError = () => {
    return errorMsg
  }

  const renderLoading = () => {
    return "Loading ..."
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(formValue)
    const sendData = {
      data: {
        ...formValue,
        match: match.id
      }
    }
    createPredictionChallenges(sendData).then((res) => {
      console.log(res)
      if(res.status === 200) {
        setShow(true);
        setFormValue({
          team_score_1: "",
          team_score_2: "",
          user_name: ""
        })
      }
    })
  }

  const renderMatch = () => {
    const bg_url = `${BACKEND_URL}${get(match, 'attributes.bg.data.attributes.url')}`;
    const team_avatar_img_url = `${BACKEND_URL}${get(match, 'attributes.avatar.data.attributes.url')}`;
    const title = get(match, 'attributes.title');
    const subtitle = get(match, 'attributes.subtitle');
    const match_time = moment(get(match, 'attributes.date')).locale(i18n.language).format('DD MMMM YYYY, HH:mm [GMT] Z');
    const team_1_url = `${BACKEND_URL}${get(match, 'attributes.football_team_1.data.attributes.logo.data.attributes.url')}`;
    const team_1_name = get(match, 'attributes.football_team_1.data.attributes.name');
    const team_2_url = `${BACKEND_URL}${get(match, 'attributes.football_team_2.data.attributes.logo.data.attributes.url')}`;
    const team_2_name = get(match, 'attributes.football_team_2.data.attributes.name');
    const ads_right_bg = `${BACKEND_URL}${get(match, 'attributes.ads_bg.data.attributes.url')}`;
    const ads_right_title = get(match, 'attributes.ads_title');
    const ads_right_subtitle = get(match, 'attributes.ads_subtitle');
    const ads_right_link = get(match, 'attributes.ads_link');
    const text_color = get(match, 'attributes.text_color', '#fff');
    const primary_color = get(match, 'attributes.primary_color');
    const secondary_color = get(match, 'attributes.secondary_color');

    const styles = {
      color: text_color,
      backgroundImage: `url(${bg_url})`
    }

    const prediction_here__styles = {
      ...primary_color && { 
        background: primary_color,
        color: secondary_color
      }
    }

    const prediction_here__caret__styles = {
      ...primary_color && { 
        borderBottomColor: primary_color
      }
    }

    const prediction_here__select__styles = {
      color: text_color
    }

    return (
      <div className="home-page" style={styles}>
        <div className="container">
          <h2 className="title">{title}</h2>
          <div className="row">
            <div className="col-xl-7 col-md-6 col-12 avatar-section">
              <LazyLoadImage className="avatar-section__avatar" src={team_avatar_img_url} alt="" />
              <div className="avatar-section__subtitle" dangerouslySetInnerHTML={{__html: subtitle}} />
            </div>
            <div className="col-xl-5 col-md-6 col-12 match-section">
              <div className="match-section__item">
                <div className="match-section__item__title" dangerouslySetInnerHTML={{__html: t('PREMIER_LEAGUE_GAME_WEEK_15')}} />
                <div className="match-section__item__time">{match_time}</div>
                <form className="match-section__item__form" onSubmit={handleFormSubmit}>
                  <div className="match-section__item__form__teams">
                    <div className="match-section__item__form__teams__team">
                      <div className="text-center">
                        <LazyLoadImage className="match-section__item__form__teams__team__logo" src={team_1_url} alt={team_1_name} />
                        <div className="match-section__item__form__teams__team__name">{team_1_name}</div>
                      </div>
                      <div className="text-center">
                        <select className="form-select match-section__item__form__teams__team__select" style={prediction_here__select__styles} name="team_score_1" value={formValue.team_score_1} onChange={handleFormChange} required>
                          <option value="">?</option>
                          {range(1, 11).map((i) => <option value={i} key={i}>{i}</option>)}
                        </select>
                        <div className="match-section__item__form__teams__team__help-text" style={prediction_here__styles}>
                          {t('prediction_here')}
                          <span className="caret" style={prediction_here__caret__styles}></span>
                        </div>
                      </div>
                    </div>
                    <div className="match-section__item__form__teams__vs">{t('VS')}</div>
                    <div className="match-section__item__form__teams__team">
                      <div className="text-center">
                        <LazyLoadImage className="match-section__item__form__teams__team__logo" src={team_2_url} alt={team_2_name} />
                        <div className="match-section__item__form__teams__team__name">{team_2_name}</div>
                      </div>
                      <div className="text-center">
                        <select className="form-select match-section__item__form__teams__team__select" style={prediction_here__select__styles} name="team_score_2" value={formValue.team_score_2} onChange={handleFormChange} required>
                          <option value="">?</option>
                          {range(1, 11).map((i) => <option value={i} key={i}>{i}</option>)}
                        </select>
                        <div className="match-section__item__form__teams__team__help-text" style={prediction_here__styles}>
                          {t('prediction_here')}
                          <span className="caret" style={prediction_here__caret__styles}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="match-section__item__form__username">
                    <a href="/" target="_blank" className="btn btn-link terms-link">{t('Terms_Conditions')}</a>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder={t('username')} name="user_name" value={formValue.user_name} onChange={handleFormChange} required />
                      <button className="btn btn-warning" type="submit" id="button-addon2">{t('Submit')}</button>
                    </div>
                  </div>
                  <div className="match-section__item__form__action">
                    <div>
                      <a href="/" target="_blank" className="btn btn-link" style={{color: text_color}}>{t('Not_yet_a_member')}</a>
                    </div>
                    <a href="/" className="btn btn-warning">{t('sign_up_here')}</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row ads">
            <div className="col-xl-7 col-lg-6 col-md-6 col-12 ads__left">
              <div className="row ads__left__items">
                <div className="col-6 ads__left__items__item">
                  <div className="ads__left__items__item__title">{t('Name_League')}</div>
                  <div className="ads__left__items__item__subtitle">{t('Juventus_vs_juventus')}</div>
                  <div className="ads__left__items__item__subsubtitle">{t('ads_time')}</div>
                </div>
                <div className="col-6 ads__left__items__item">
                  <div className="ads__left__items__item__score">
                    <div>1</div>
                    <div>X</div>
                    <div>2</div>
                  </div>
                  <div className="ads__left__items__item__rank">
                    <div>2.6</div>
                    <div>2.6</div>
                    <div>2.6</div>
                  </div>
                  <div className="ads__left__items__item__action">
                    <a href="/" className="btn btn-warning">{t('Join_Now')}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 col-md-6 col-12 ads__right" style={{backgroundImage: `url(${ads_right_bg})`}}>
              <div className="row h-100">
                <div className="col-xl-7 col-8 offset-xl-5 offset-4 ads__right__content">
                  <div className="ads__right__content__title">{ads_right_title}</div>
                  <div className="ads__right__content__subtitle">{ads_right_subtitle}</div>
                  <div className="ads__right__content__action">
                    <a href={ads_right_link} className="btn btn-warning">{t('Join_Now')}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="more-prediction">
            <a href="/" className="title">{t('More_prediction_Challenges')}</a>
            <div className="other-match">
              {
                matchs.map((value, k) =>
                  value.id !== match.id && <Link to={`/${get(value, 'attributes.slug')}`}>
                    <img src={`${BACKEND_URL}${get(value, 'attributes.football_team_1.data.attributes.logo.data.attributes.url')}`} alt={get(value, 'attributes.title')} />
                    <div>{get(value, 'attributes.title')}</div>
                  </Link>
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    return (!loading && !match) ? renderError() : renderMatch()
  }

  return (
    <div className="home-section">
      {show && <SuccessModal show={show} handleClose={() => setShow(false)} message={t('Success')} />}
      {loading ? renderLoading() : renderContent()}
    </div>
  );
}

export default Home;
