import PropTypes from 'prop-types';
import Card from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';
import { useEffect, useState } from "react";
import axios from "axios";

const Grid = ({ homes = [] }) => {

  const [favorites, setFavorites] = useState([]);

  const isEmpty = homes.length === 0;

  useEffect(() => {
    (async () => {
      //Retrieve all favorite home for user
      try {
        const favoriteHome = await axios.get(`/api/user/favorites`);
        setFavorites(favoriteHome.data)
      } catch (e) {
        console.log("error", e);
        setFavorites([])
      }
    })();
  }, [])

  const toggleFavorite = async id => {
    //Add/remove home from the authenticated user's favorites
    let returnFavorite;
    const isFav = favorites.find(fav => fav.id === id)

    if (isFav) {
      returnFavorite = await axios.delete(`/api/homes/${id}/favorite`);
      const newFav = favorites.filter(fav => fav.id !== returnFavorite.data.id)
      setFavorites(newFav);
    } else {
      returnFavorite = await axios.put(`/api/homes/${id}/favorite`);
      setFavorites([...favorites, returnFavorite.data]);
    }

  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map(home => (
        <Card
          key={home.id}
          {...home}
          onClickFavorite={toggleFavorite}
          favorite={(favorites.find(fav => fav.id === home.id))}
        />
      ))}
    </div>
  );
};

Grid.propTypes = {
  homes: PropTypes.array,
};

export default Grid;