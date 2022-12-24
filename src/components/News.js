import React, { useState, useEffect } from "react";
import { flatten, isEmpty, set, uniq } from "lodash";
import moment from "moment";

const News = () => {
  const [allNews, setAllNews] = useState([]);
  const [newsView, setNewsView] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    setCurrentNews();
  }, [allNews]);

  const fetchNews = async () => {
    await fetch("https://news-app-api--akshsharma.repl.co/api/news/list")
      .then((response) => response.json())
      .then((data) => {
        setAllNews(data);
      });
  };

  const setCurrentNews = () => {
    let newsRead = window.localStorage.getItem("read");
    if (!isEmpty(newsRead)) {
      let splitIds = newsRead.split(",");
      let newsViewed = allNews.filter((o) => o._id.includes(splitIds));
      let unreadNews = allNews.filter(
        (entry1) => !splitIds.some((entry2) => entry1._id === entry2)
      );
      let rearrangeNews = [...unreadNews, ...newsViewed];
      setNewsView(rearrangeNews);
      if (!isEmpty(newsView)) {
        window.localStorage.setItem("read", newsView[0]?._id);
      }
    } else {
      setNewsView(allNews);
      if (newsView) {
        window.localStorage.setItem("read", newsView[0]?._id);
      }
    }
  };

  const storeReadNews = (e) => {
    let combineValues = [];
    let c = document.getElementsByClassName("active")[0].id;
    let updateLocalStorage = window.localStorage.getItem("read");
    combineValues.push(updateLocalStorage.split(","));
    combineValues.push(c);
    let flattenAndUniq = uniq(flatten(combineValues));
    window.localStorage.setItem("read", flattenAndUniq);
  };

  const reset = () =>{
    window.localStorage.removeItem('read');
    fetchNews();
  }

  return (
    <>
      {!isEmpty(newsView) ? (
        <>
          <div style={{ height: "25vh" }}>
            <div
              id="carouselExampleCaptions"
              class="carousel slide"
              data-mdb-ride="false"
            >
              <div class="carousel-inner">
                {newsView &&
                  newsView.map((item, index) => {
                    return (
                      <div
                        className={
                          index === 0 ? "carousel-item active" : "carousel-item"
                        }
                        id={item._id}
                        key={index}
                      >
                        <img
                          src={item.image}
                          class="d-block w-100"
                          alt="Wild Landscape"
                        />
                        <div class="carousel-caption d-none d-md-block">
                          <h1>Title : {item.title}</h1>
                          <h5>Author : {item.authorName}</h5>
                          <h5>
                            Publish Date :{" "}
                            {moment(item.publishDate).format(
                              "DD-MM-YYYY hh:mm a"
                            )}
                          </h5>
                          <p>{item.article}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <button
                class="carousel-control-prev"
                type="button"
                data-mdb-target="#carouselExampleCaptions"
                data-mdb-slide="prev"
                onClick={storeReadNews}
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-mdb-target="#carouselExampleCaptions"
                data-mdb-slide="next"
                onClick={storeReadNews}
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
            <h1>All News have been read, Click here to reload news again </h1>
          <button type="button" class="btn btn-success" onClick={reset}>
            Reload
          </button>
        </>
      )}
    </>
  );
};

export default News;
