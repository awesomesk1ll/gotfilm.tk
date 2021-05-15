import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { favoriteIconPush, removeFromListAndSave } from '../../store/actions/complexFilmActions';

import ListItem from '../../components/ListItem';
import Navigation from '../../components/Navigation';
import './Lists.scss';


const SeenList = ({ films, favorites, alreadySeen, favoriteIconPush, removeFromListAndSave }) => {
    const handleAddToFavorites = useCallback((filmId) => {
        favoriteIconPush(filmId);
    }, [favoriteIconPush]);

    const handleRemoveFromList = useCallback((filmId) => {
        removeFromListAndSave(filmId, "alreadySeen");
    }, [removeFromListAndSave]);
    
    let list = films.length && alreadySeen.data.map(item => {
        let film = films.find(film => film.id === item.id);

        if (!film) {
            return <div key={item.id} className="lists__list--null">Фильм загружается</div>
        }

        return <CSSTransition key={film.id} timeout={300} className="lists__list--item">
                    <ListItem   key={film.id} 
                                name={film.name} 
                                secondName={film.secondName} 
                                year={film.year} 
                                rate={film.rate} 
                                age={film.age} 
                                genre={film.genre} 
                                addToFavorites={() => handleAddToFavorites(film.id)} 
                                removeFromList={() => handleRemoveFromList(film.id)} 
                                status={favorites.list[film.id]} 
                    />
                </CSSTransition>
    }).reverse();
    
    const transitionGroup = () => <TransitionGroup className="lists__list">{ list }</TransitionGroup>

    return (
        <div className="lists--wrapper theme">
            <div className="lists__header theme">Просмотренные</div>
            { list?.length ? transitionGroup() : (<div className="lists__placeholder"/>) }
            <div className="lists__emptyBlock"></div>
            <Navigation checked={'lists'} />
        </div>
    )
};

SeenList.propTypes = {
    alreadySeen: PropTypes.object,
    favorites: PropTypes.object,
    films: PropTypes.array,
    favoriteIconPush: PropTypes.func,
    removeFromListAndSave: PropTypes.func
};

const mapStateToProps = ({ filmReducer }) => ({
    films: filmReducer.films,
    favorites: filmReducer.favorites,
    alreadySeen: filmReducer.alreadySeen
});

const mapDispatchToProps = dispatch => bindActionCreators({ favoriteIconPush, removeFromListAndSave }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SeenList);