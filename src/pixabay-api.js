import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export const getImages = async (searchQuery, page = 1) => {
  try {
    const urlSeaParams = new URLSearchParams({
      key: '40511687-cbadb7257ae9d9e32908df6a3',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: searchQuery,
      page,
      per_page: 40,
    });

    const response = await axios.get(`?${urlSeaParams}`);
    return response.data;
  } catch (error) {
    Notify.warning('Oops! Something went wrong');
  }
};
