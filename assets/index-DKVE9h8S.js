var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _Modal_instances, createModal_fn, handleEscKey_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const createDOMElement = ({
  tag,
  children = [],
  attributes = {},
  event = {},
  ...props
}) => {
  const element = document.createElement(tag);
  Object.entries(event).forEach(([eventName, eventHandler]) => {
    element.addEventListener(eventName, eventHandler);
  });
  Object.entries(attributes).forEach(([attrName, attributes2]) => {
    element.setAttribute(attrName, String(attributes2));
  });
  Object.entries(props).forEach(([propName, propValue]) => {
    if (propName in element) {
      element[propName] = propValue;
    }
  });
  children.forEach((child) => element.appendChild(child));
  return element;
};
function MessageDisplay({ text }) {
  return createDOMElement({
    tag: "div",
    className: "no-result",
    children: [
      createDOMElement({
        tag: "img",
        attributes: {
          src: "images/으아아행성이.svg"
        }
      }),
      createDOMElement({
        tag: "p",
        textContent: text
      })
    ]
  });
}
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const BASE_URL = "https://api.themoviedb.org/3";
const INITIAL_PAGE = 1;
const MOVIE_INDEX_FOR_BANNER = 1;
const TOTAL_PAGES = 500;
function $(selector) {
  return document.querySelector(selector);
}
class ApiClient {
  static async get(endpoint, headers = {}) {
    return this.request("GET", endpoint, headers);
  }
  static handleError() {
    var _a;
    const skeleton = $(".skeleton");
    skeleton == null ? void 0 : skeleton.remove();
    const errorUI = createDOMElement({
      tag: "div",
      className: "error-ui",
      children: [MessageDisplay({ text: "새로고침을 해주세요!" })]
    });
    (_a = $(".container")) == null ? void 0 : _a.replaceChildren(errorUI);
  }
  static async request(method, endpoint, headers = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYjg5NWI5YjViODM5MzdlZTcyYmY2ZjVmMmZmMjJiNyIsIm5iZiI6MTcxNTA0MzkxMi4yNjEsInN1YiI6IjY2Mzk3ZTQ4NWFkNzZiMDEyOTA2MGE1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5FfMwZotalpEeap77mJPSlgkgirv04zUxoXjpymxKy0"}`,
        ...headers
      }
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      return data;
    } catch (error) {
      ApiClient.handleError();
      throw error;
    }
  }
}
const getPopularMovies = async ({ page }) => {
  const params = new URLSearchParams({
    language: "ko-KR",
    page: page.toString()
  });
  const data = await ApiClient.get(`/movie/popular?${params.toString()}`);
  return data;
};
function Footer() {
  return createDOMElement({
    tag: "footer",
    className: "footer",
    children: [
      createDOMElement({
        tag: "p",
        innerText: "© 우아한테크코스 All Rights Reserved."
      }),
      createDOMElement({
        tag: "p",
        children: [
          createDOMElement({
            tag: "img",
            attributes: {
              src: "./images/woowacourse_logo.png",
              width: "180"
            }
          })
        ]
      })
    ]
  });
}
const addFooter = () => {
  const wrap = $("#wrap");
  if (!wrap) return;
  const footer = Footer();
  wrap.appendChild(footer);
};
function Button({ text, id, className = "primary", onClick, ...rest }) {
  return createDOMElement({
    tag: "button",
    className: "primary",
    innerText: text,
    event: onClick ? { click: onClick } : void 0,
    attributes: {
      id,
      ...rest
    }
  });
}
const getMovieDetail = async ({ movieId }) => {
  const params = new URLSearchParams({
    language: "ko-KR"
  });
  const data = await ApiClient.get(`/movie/${movieId}?${params}`);
  return data;
};
const LOCAL_STORAGE_KEYS = {
  RATING: "rating"
};
function getLocalStorage(key, defaultValue) {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
}
function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function StarRating({ movieId }) {
  const savedRating = getMovieRating(movieId);
  const descriptionText = createDOMElement({
    tag: "span",
    className: "rating-desc",
    textContent: savedRating ? RATING_TEXT_MAP[savedRating] + " " : ""
  });
  const scoreText = createDOMElement({
    tag: "span",
    className: "score-highlight",
    textContent: savedRating ? `(${savedRating}/10)` : ""
  });
  const ratingTextElement = createDOMElement({
    tag: "p",
    className: "my-rating-text",
    children: [descriptionText, scoreText]
  });
  const stars = Array.from({ length: 5 }, (_, i) => {
    const value = (i + 1) * 2;
    const isFilled = value <= savedRating;
    const star = createDOMElement({
      tag: "img",
      className: "star rating-star",
      attributes: {
        src: isFilled ? STAR_IMAGE_SRC.FILLED : STAR_IMAGE_SRC.EMPTY,
        "data-value": String(value)
      }
    });
    star.addEventListener("click", () => {
      setMovieRating(movieId, value);
      stars.forEach((s, idx) => {
        const starVal = (idx + 1) * 2;
        s.setAttribute("src", starVal <= value ? STAR_IMAGE_SRC.FILLED : STAR_IMAGE_SRC.EMPTY);
      });
      descriptionText.textContent = RATING_TEXT_MAP[value] + " ";
      scoreText.textContent = `(${value}/10)`;
    });
    return star;
  });
  return createDOMElement({
    tag: "div",
    className: "real-rating",
    children: [createDOMElement({ tag: "div", className: "my-stars", children: stars }), ratingTextElement]
  });
}
const RATING_TEXT_MAP = {
  2: "최악이에요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요"
};
const getMovieRating = (movieId) => {
  const ratings = getLocalStorage(LOCAL_STORAGE_KEYS.RATING, {});
  return ratings[movieId] ?? 0;
};
const setMovieRating = (movieId, value) => {
  const ratings = getLocalStorage(LOCAL_STORAGE_KEYS.RATING, {});
  const updatedRatings = { ...ratings, [movieId]: value };
  setLocalStorage(LOCAL_STORAGE_KEYS.RATING, updatedRatings);
};
const STAR_IMAGE_SRC = {
  FILLED: "images/star_filled.png",
  EMPTY: "images/star_empty.png"
};
function DetailModal(movie) {
  const { id, title, vote_average, overview, poster_path, release_date, genres } = movie;
  const posterUrl = poster_path ? `${IMAGE_BASE_URL}/w440_and_h660_face/${poster_path}` : "https://placehold.co/300x440?text=No+Image";
  const genreText = genres.map((g) => g.name).join(", ");
  const rating = vote_average.toFixed(1);
  const year = release_date.slice(0, 4);
  const modalImage = createDOMElement({
    tag: "div",
    className: "modal-image",
    children: [
      createDOMElement({
        tag: "img",
        attributes: {
          src: posterUrl,
          alt: title
        }
      })
    ]
  });
  const averageRate = createDOMElement({
    tag: "p",
    className: "average-rate",
    children: [
      createDOMElement({ tag: "span", textContent: "평균", className: "average" }),
      createDOMElement({
        tag: "p",
        className: "rate",
        children: [
          createDOMElement({ tag: "img", className: "star", attributes: { src: "./images/star_filled.png" } }),
          createDOMElement({ tag: "span", textContent: rating })
        ]
      })
    ]
  });
  const myRatingSection = createDOMElement({
    tag: "div",
    className: "my-rating",
    children: [
      createDOMElement({ tag: "span", className: "my-rating-title", textContent: "내 별점" }),
      StarRating({ movieId: id })
    ]
  });
  const description = createDOMElement({
    tag: "div",
    className: "modal-description",
    children: [
      createDOMElement({
        tag: "div",
        className: "title-category",
        children: [
          createDOMElement({ tag: "h2", textContent: title }),
          createDOMElement({ tag: "p", className: "category", textContent: `${year} · ${genreText}` }),
          averageRate
        ]
      }),
      createDOMElement({ tag: "hr" }),
      myRatingSection,
      createDOMElement({ tag: "hr" }),
      createDOMElement({
        tag: "div",
        className: "overview-wrapper",
        children: [
          createDOMElement({
            tag: "h3",
            textContent: "줄거리"
          }),
          createDOMElement({
            tag: "p",
            className: "overview",
            textContent: overview || "줄거리 정보가 없습니다."
          })
        ]
      })
    ]
  });
  return createDOMElement({
    tag: "div",
    className: "detail-modal",
    children: [modalImage, description]
  });
}
const lockScroll = () => {
  const body = document.body;
  body.style.overflow = "hidden";
};
const unlockScroll = () => {
  const body = document.body;
  body.style.overflow = "auto";
};
class Modal {
  constructor() {
    __privateAdd(this, _Modal_instances);
    __publicField(this, "modalWrapper");
    __publicField(this, "modal");
    __publicField(this, "content");
    __publicField(this, "handleEscKey");
    this.modalWrapper = $(".modal-background") || __privateMethod(this, _Modal_instances, createModal_fn).call(this);
    this.modal = this.modalWrapper.querySelector(".modal");
    this.content = this.modal.querySelector(".modal-content");
    this.handleEscKey = __privateMethod(this, _Modal_instances, handleEscKey_fn).bind(this);
  }
  open(content) {
    this.content.innerHTML = "";
    this.content.appendChild(content);
    this.modalWrapper.classList.add("active");
    lockScroll();
    document.addEventListener("keydown", this.handleEscKey);
  }
  close() {
    this.modalWrapper.classList.remove("active");
    unlockScroll();
    document.removeEventListener("keydown", this.handleEscKey);
    this.content.innerHTML = "";
  }
}
_Modal_instances = new WeakSet();
createModal_fn = function() {
  const content = createDOMElement({
    tag: "div",
    className: "modal-content"
  });
  const modal = createDOMElement({
    tag: "div",
    className: "modal",
    children: [content]
  });
  const modalWrapper = createDOMElement({
    tag: "div",
    className: "modal-background",
    children: [modal]
  });
  modalWrapper.addEventListener("click", (e) => {
    if (e.target === modalWrapper) this.close();
  });
  document.body.appendChild(modalWrapper);
  return modalWrapper;
};
handleEscKey_fn = function(event) {
  if (event.key === "Escape") {
    this.close();
  }
};
const Modal$1 = new Modal();
function Banner({ movie }) {
  const { backdrop_path, vote_average, title } = movie;
  return createDOMElement({
    tag: "header",
    children: [
      createDOMElement({
        tag: "div",
        className: "background-container",
        children: [BackDrop({ backDropUrl: backdrop_path }), TopRatedMovie({ id: movie.id, vote_average, title })]
      })
    ]
  });
}
function BackDrop({ backDropUrl }) {
  return createDOMElement({
    tag: "div",
    className: "overlay",
    attributes: { "aria-hidden": "true" },
    children: [
      createDOMElement({
        tag: "img",
        attributes: { src: `${IMAGE_BASE_URL}/w1920/${backDropUrl}` }
      })
    ]
  });
}
function TopRatedMovie({ vote_average, title, id }) {
  const handleDetailClick = async () => {
    const response = await getMovieDetail({ movieId: id });
    if (!response) return;
    Modal$1.open(DetailModal(response));
  };
  return createDOMElement({
    tag: "div",
    className: "top-rated-container",
    children: [
      createDOMElement({
        tag: "div",
        className: "top-rated-movie",
        children: [
          createDOMElement({
            tag: "div",
            className: "rate",
            children: [
              createDOMElement({
                tag: "img",
                className: "star",
                attributes: { src: "images/star_empty.png" }
              }),
              createDOMElement({
                tag: "span",
                className: "rate-value",
                textContent: vote_average.toFixed(1)
              })
            ]
          }),
          createDOMElement({
            tag: "div",
            className: "title",
            textContent: title
          }),
          Button({
            text: "자세히보기",
            id: "detail",
            onClick: handleDetailClick
          })
        ]
      })
    ]
  });
}
const removeBanner = () => {
  const banner = document.querySelector("header");
  banner == null ? void 0 : banner.remove();
  const main = document.querySelector("main");
  if (!main) return;
};
const addBanner = (banner) => {
  const wrap = $("#wrap");
  wrap == null ? void 0 : wrap.prepend(banner);
};
const DEFAULT_IMAGE_URL = "https://placehold.co/200x300?text=No+Image";
function Movie({ movie }) {
  const poster_path = movie.poster_path ? IMAGE_BASE_URL + "/w440_and_h660_face/" + movie.poster_path : DEFAULT_IMAGE_URL;
  return createDOMElement({
    tag: "li",
    className: "item",
    children: [
      createDOMElement({
        tag: "img",
        className: "thumbnail",
        attributes: {
          src: poster_path,
          alt: movie.title
        }
      }),
      createDOMElement({
        tag: "div",
        className: "item-desc",
        children: [
          createDOMElement({
            tag: "p",
            className: "rate",
            children: [
              createDOMElement({
                tag: "img",
                className: "star",
                attributes: { src: "images/star_empty.png" }
              }),
              createDOMElement({
                tag: "span",
                innerText: movie.vote_average.toFixed(1)
              })
            ]
          }),
          createDOMElement({
            tag: "strong",
            innerText: movie.title
          })
        ]
      })
    ],
    event: { click: () => handleMovieClick(movie.id) }
  });
}
const handleMovieClick = async (movieId) => {
  const response = await getMovieDetail({ movieId });
  Modal$1.open(DetailModal(response));
};
function MovieList({ title, movies }) {
  return createDOMElement({
    tag: "div",
    children: [
      createDOMElement({
        tag: "h2",
        textContent: title
      }),
      movies.length !== 0 ? createDOMElement({
        tag: "ul",
        className: "thumbnail-list",
        children: movies.map((movie) => Movie({ movie }))
      }) : MessageDisplay({ text: "검색 결과가 없습니다." })
    ]
  });
}
const addMoreMovieList = (newMovies) => {
  const container = $(".thumbnail-list");
  if (!container) return;
  const fragment = document.createDocumentFragment();
  newMovies.forEach((movie) => {
    const newMovie = Movie({ movie });
    fragment.appendChild(newMovie);
  });
  container.appendChild(fragment);
};
const addMovieList = ({ movies, title }) => {
  const container = $(".container");
  if (!container) return;
  const movieList = MovieList({ movies, title });
  container.appendChild(movieList);
};
const createObserverTarget = () => {
  return createDOMElement({
    tag: "div",
    className: "observer-target",
    attributes: { "data-observe": "true" }
  });
};
const getSearchMovies = async ({ page, query }) => {
  const params = new URLSearchParams({
    include_adult: "false",
    language: "ko-KR",
    page: String(page),
    query
  });
  const data = await ApiClient.get(`/search/movie?${params.toString()}`);
  return data;
};
const Skeleton = ({ height }) => {
  return createDOMElement({
    tag: "div",
    className: "skeleton",
    attributes: {
      style: `height: ${height}px`
    }
  });
};
const addBannerSkeleton = () => {
  const wrap = $("#wrap");
  if (!wrap) return;
  const bannerSkeleton = createDOMElement({
    tag: "div",
    className: "banner-skeleton-wrapper",
    children: [Skeleton({ height: 500 })]
  });
  wrap.prepend(bannerSkeleton);
};
const removeBannerSkeleton = () => {
  const skeleton = $(".banner-skeleton-wrapper");
  if (!skeleton) return;
  skeleton.remove();
};
function SkeletonList({ height }) {
  return createDOMElement({
    tag: "ul",
    className: "skeleton-list",
    children: Array.from({ length: 20 }, () => {
      return Skeleton({ height });
    })
  });
}
const addSkeletonList = (container) => {
  const skeletonList = SkeletonList({ height: 300 });
  container.appendChild(skeletonList);
  return skeletonList;
};
const removeSkeletonList = () => {
  const skeletonList = $(".skeleton-list");
  if (!skeletonList) return;
  skeletonList.remove();
};
function createInfiniteScrollObserver(target, callback, options = { root: null, threshold: 1 }) {
  const observer = new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
      callback();
    }
  }, options);
  observer.observe(target);
  return observer;
}
function SearchBar() {
  return createDOMElement({
    tag: "form",
    id: "searchForm",
    className: "search-form",
    children: [
      createDOMElement({
        tag: "input",
        attributes: { placeholder: "검색어를 입력하세요", type: "text", name: "keyword" }
      }),
      createDOMElement({
        tag: "button",
        children: [
          createDOMElement({
            tag: "img",
            attributes: { src: "images/search.png", alt: "검색 아이콘" }
          })
        ]
      })
    ],
    event: { submit: handleSearchMovies }
  });
}
const handleSearchMovies = async (e) => {
  e.preventDefault();
  removeBanner();
  const searchKeyword = getSearchKeyword(e);
  if (!searchKeyword) return;
  await renderMovies(searchKeyword);
};
const getSearchKeyword = (e) => {
  const form = e.target;
  const data = new FormData(form);
  const keyword = data.get("keyword");
  return keyword ? String(keyword) : null;
};
const renderMovies = async (searchKeyword) => {
  const container = $(".container");
  if (!container) return;
  const skeletonList = SkeletonList({ height: 300 });
  container.replaceChildren(skeletonList);
  const response = await getSearchMovies({ page: 1, query: searchKeyword });
  if (!response) return;
  const { results: movies, total_pages } = response;
  let currentPage2 = 1;
  const searchedMovieList = MovieList({
    movies,
    title: `"${searchKeyword}" 검색 결과`
  });
  container.replaceChildren(searchedMovieList);
  if (currentPage2 < total_pages) {
    observeNextPage(searchKeyword, total_pages, currentPage2);
  }
};
const observeNextPage = (searchKeyword, totalPages, startPage = 1) => {
  let page = startPage;
  const container = $(".container");
  const list = $(".thumbnail-list");
  if (!container || !list) return;
  const observe = async () => {
    page++;
    if (page > totalPages) return;
    const response = await getSearchMovies({ page, query: searchKeyword });
    response.results.forEach((movie) => {
      list.appendChild(Movie({ movie }));
    });
    const newTarget = createObserverTarget();
    container.appendChild(newTarget);
    createInfiniteScrollObserver(newTarget, observe);
  };
  observe();
};
function Header() {
  return createDOMElement({
    tag: "div",
    className: "logo",
    children: [
      createDOMElement({
        tag: "a",
        attributes: {
          href: "/"
        },
        children: [
          createDOMElement({
            tag: "img",
            className: "logo-img",
            attributes: {
              src: "images/logo.png",
              alt: "MovieList"
            }
          })
        ]
      }),
      SearchBar()
    ]
  });
}
const addHeader = () => {
  const wrap = $("#wrap");
  if (!wrap) return;
  const header = Header();
  wrap.prepend(header);
};
addEventListener("DOMContentLoaded", async () => {
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
  const container = $(".container");
  if (!container) return;
  addSkeletonList(container);
  const response = await getPopularMovies({ page: currentPage });
  removeSkeletonList();
  addMovieList({ movies: response.results, title: "지금 인기있는 영화" });
  observeScroll();
};
let isFetching = false;
const observeScroll = () => {
  const container = $(".container");
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
