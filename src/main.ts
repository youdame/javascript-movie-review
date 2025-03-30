import getPopularMovies from './api/getPopularMovies';
import { addFooter } from './component/Footer';
import Banner, { addBanner } from './component/Banner';
import { addMoreMovieList, addMovieList, createObserverTarget } from './component/MovieList';
import { $ } from './util/selector';
import { addHeader } from './component/Header';
import { addBannerSkeleton, removeBannerSkeleton } from './component/Skeleton';
import { addSkeletonList, removeSkeletonList } from './component/SkeletonList';
import { INITIAL_PAGE, MOVIE_INDEX_FOR_BANNER, TOTAL_PAGES } from './constant';
import { createInfiniteScrollObserver } from './util/intersectionObserver';

addEventListener('DOMContentLoaded', async () => {
  renderBanner();
  renderHeader();
  renderMovieList();
  renderFooter();
});

const renderBanner = async () => {
  addBannerSkeleton();

  const response = await getPopularMovies({ page: 1 });

  removeBannerSkeleton();

  addBanner(Banner({ movie: response.results[MOVIE_INDEX_FOR_BANNER] }));
};

const renderHeader = () => {
  addHeader();
};

let currentPage = INITIAL_PAGE;

const renderMovieList = async () => {
  const container = $('.container');
  if (!container) return;

  addSkeletonList(container);

  const response = await getPopularMovies({ page: currentPage });
  removeSkeletonList();

  addMovieList({ movies: response.results, title: '지금 인기있는 영화' });

  observeScroll();
};

let isFetching = false;

const observeScroll = () => {
  const container = $('.container');
  if (!container) return;

  const observe = async () => {
    if (isFetching || currentPage >= TOTAL_PAGES) return;
    isFetching = true;

    currentPage++;
    addSkeletonList(container);

    const res = await getPopularMovies({ page: currentPage });

    removeSkeletonList();
    addMoreMovieList(res.results);

    isFetching = false;

    const newTarget = createObserverTarget();
    container.appendChild(newTarget);
    createInfiniteScrollObserver(newTarget, observe);
  };

  const initialTarget = createObserverTarget();
  container.appendChild(initialTarget);
  createInfiniteScrollObserver(initialTarget, observe);
};

const renderFooter = () => {
  addFooter();
};
