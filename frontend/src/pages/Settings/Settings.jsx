import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Typography, Button, Slider, Select, Switch, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { clearSettings } from '../../store/actions/filmActions';
import { setSettingsAndSave, createFilteredFilms } from '../../store/actions/complexFilmActions';

import { TYPES, RATINGS, YEARS, GENRES, COUNTRIES } from './config';
import './Settings.scss';

const DEFAULT_HUE = 36;
const DEFAULT_RATING = [7, 10];
const DEFAULT_YEARS = [1990, 2021];

const { confirm } = Modal;
const { Title, Text } = Typography;

const Settings = ({ settings, clearSettings, setSettingsAndSave, filmsCount, filteredFilmsCount, isLazyLoading, createFilteredFilms }) => {
    const [selectedRatings, setSelectedRatings] = React.useState(settings.filters.ratings);
    const [selectedYears, setSelectedYears] = React.useState(settings.filters.years);
    const [selectedColor, setSelectedColor] = React.useState(settings.color.hue);

    const setSettings = useCallback((value, type) => {
        // отправляем новое состояние в store
        setSettingsAndSave({ 
            dark: (type === 'mode') ? value : settings.dark,
            color: (type === 'color') ? { hue: value } : settings.color,
            filters: {
                types: (type === 'types') ? value : settings.filters.types,
                ratings: (type === 'ratings') ? value : settings.filters.ratings,
                years: (type === 'years') ? value : settings.filters.years,
                genres: (type === 'genres') ? value : settings.filters.genres,
                countries: (type === 'countries') ? value : settings.filters.countries
            }
        });
    }, [settings, setSettingsAndSave]);
   

    const handleSelect = useCallback((value, type) => {
        if (value === "Все") {
            switch (type) {
                case 'genres':
                    setSettings(GENRES.map(genre => genre.value), 'genres');
                    break;
                case 'countries':
                    setSettings(COUNTRIES.map(country => country.value), 'countries');
                    break;
                default:
            }
        }
    }, [setSettings]);

    const handleDeSelect = useCallback((value, type) => {
        if (value === "Все") {
            (type === "genres") ? setSettings([], 'genres') : setSettings([], 'countries')
        }
        if (type === "types" && settings.filters.types.length === 1) {
            setSettings(TYPES.map(type => type.value), 'types')
        }
    }, [setSettings, settings]);

    const handleClearSettings = useCallback(() => {
        confirm({
            title: 'Сброс настроек',
            icon: <ExclamationCircleOutlined />,
            okText: 'Выполнить сброс',
            okType: 'danger',
            cancelText: 'Отмена',
            style: {top: "50%"},
            content: 'Все настройки будут переведены в статус "По умолчанию". Данное действие не затрагивает списки фильмов. Вы уверены?',
            onOk() {
                localStorage.removeItem('settings');
                clearSettings();
                createFilteredFilms();
                setSelectedColor(DEFAULT_HUE);
                setSelectedRatings(DEFAULT_RATING);
                setSelectedYears(DEFAULT_YEARS);
            }, onCancel() {}
          });
    }, [clearSettings, createFilteredFilms]);

    const getColorTooltip = () => <div style={{color: `hsl(${selectedColor},70%,52%)`, letterSpacing: -2, marginRight: 2}}>██</div>;

    return (
        <div className="settings--wrapper theme">
            <div className="settings__header theme" onClick={() => {window.location.replace(window.location.href)}}>
                <div className="settings__header--title" level={2}>Настройки</div>
            </div>
            <div className="settings__content">
                <Link type="secondary" className="settings__content--login" to='/login'>
                    <Button size="large">Вход / Регистрация</Button>
                </Link>

                <div className="settings__content--row">
                    <Text className="theme">Темная версия оформления</Text>
                    <Switch onChange={(val) => {setSettings(val, "mode")}} value={settings.dark} checked={settings.dark} />
                </div>

                <div className="settings__content--row">
                    <Text className="theme">Цвет</Text>
                    <Slider className="settings__content--color"
                            min={0} max={360} defaultValue={selectedColor}
                            tipFormatter={getColorTooltip}
                            value={selectedColor}
                            style={{"--gf-handle-color": `hsl(${selectedColor},70%,52%)`}}
                            onChange={setSelectedColor}
                            onAfterChange={(val) => {setSettings(val, "color")}}
                    />
                </div>

                <Title level={3} style={{marginBottom:0}}>Настройки поиска</Title>

                <div className="settings__content--row">
                    <Text className="theme">Тип</Text>
                    <Select className="settings__content--select"
                            mode="multiple"
                            showArrow
                            maxTagCount="responsive"
                            value={settings.filters.types}
                            onChange={(val) => {setSettings(val, "types")}}
                            onDeselect={(val) => {handleDeSelect(val, "types")}}
                            options={TYPES}
                    />
                </div>

                <div className="settings__content--row theme">
                    <Text className="theme">Рейтинг</Text>
                    <Slider className="settings__content--slider" range
                            marks={RATINGS} min={5} max={10} step={0.1} defaultValue={settings.filters.ratings}
                            value={selectedRatings}
                            onChange={setSelectedRatings}
                            onAfterChange={(val) => {setSettings(val, "ratings")}}
                    />
                </div>

                <div className="settings__content--row">
                    <Text className="theme">Годы</Text>
                    <Slider className="settings__content--slider" range
                            marks={YEARS} min={1950} max={2021} defaultValue={settings.filters.years}
                            value={selectedYears}
                            onChange={setSelectedYears}
                            onAfterChange={(val) => {setSettings(val, "years")}}
                    />
                </div>

                <div className="settings__content--row">
                    <Text className="theme">Жанры</Text>
                    <Select className="settings__content--select"
                            mode="multiple"
                            showArrow
                            value={settings.filters.genres}
                            onSelect={(val) => {handleSelect(val, "genres")}}
                            onDeselect={(val) => {handleDeSelect(val, "genres")}}
                            onChange={(val) => {setSettings(val, "genres")}}
                            options={GENRES}
                            maxTagCount="responsive"
                            placeholder='не задано'
                    />
                </div>

                <div className="settings__content--row">
                    <Text className="theme">Страны</Text>
                    <Select className="settings__content--select"
                            mode="multiple"
                            showArrow
                            value={settings.filters.countries}
                            onSelect={(val) => {handleSelect(val, "countries")}}
                            onDeselect={(val) => {handleDeSelect(val, "countries")}}
                            onChange={(val) => {setSettings(val, "countries")}}
                            options={COUNTRIES}
                            maxTagCount="responsive"
                            placeholder='не задано'
                    />
                </div>

                <Text className={`settings__content--counter${ (filteredFilmsCount < 4 || isLazyLoading) ? ' warning' : '' }`} code>
                    {isLazyLoading ? `Загрузка фильмов: ${filmsCount}` : `Найдено фильмов: ${filteredFilmsCount} из ${filmsCount}`}
                </Text>

                <Button type="secondary" size="large" className="settings__content--reset" onClick={handleClearSettings}>
                    Сбросить настройки
                </Button>

            </div>
        </div>
    )
};

const mapStateToProps = ({ filmReducer }) => ({
    settings: filmReducer.settings,
    filmsCount: filmReducer.films.length,
    filteredFilmsCount: filmReducer.filteredFilms.length,
    isLazyLoading: filmReducer.isLazyLoading
});

Settings.propTypes = {
    clearSettings: PropTypes.func,
    setSettingsAndSave: PropTypes.func,
    createFilteredFilms: PropTypes.func,
    settings: PropTypes.object,
    filmsCount: PropTypes.number,
    filteredFilmsCount: PropTypes.number,
    isLazyLoading: PropTypes.bool
};

const mapDispatchToProps = dispatch => bindActionCreators({ clearSettings, setSettingsAndSave, createFilteredFilms }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Settings);