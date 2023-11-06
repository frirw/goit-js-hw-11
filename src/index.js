import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getImages } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const inputForm = document.querySelector('.search-form');
const imgGallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a');
let page = 1;
let value = '';
inputForm.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  value = event.target.elements.searchQuery.value.trim();
  if (!value) return;
  page = 1;

  try {
    const { totalHits, hits } = await getImages(value, page);

    if (!hits.length) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    clearGallery();
    if (totalHits <= 40) {
      loadMoreButton.classList.add(`is-hidden`);
    } else {
      loadMoreButton.classList.remove(`is-hidden`);
    }
    const markup = createGallery(hits);
    addMarkup(markup);
    lightbox.refresh();
  } catch (error) {
    onError();
  } finally {
    event.target.reset();
  }
}

function createGallery(items = []) {
  return items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href='${largeImageURL}'>
     <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${downloads}
    </p>
  </div>
</div></a>
     `;
      }
    )
    .join('');
}

function addMarkup(markup = '') {
  imgGallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  imgGallery.innerHTML = '';
}

loadMoreButton.addEventListener('click', onClick);

async function onClick() {
  try {
    page += 1;
    const { totalHits, hits } = await getImages(value, page);
    const markup = createGallery(hits);
    addMarkup(markup);
    lightbox.refresh();
    scrollPage();
    if (page * 40 >= totalHits) {
      loadMoreButton.classList.add('is-hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    onError();
  }
}

function onError() {
  Notify.warning('Oops! Something went wrong');
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
