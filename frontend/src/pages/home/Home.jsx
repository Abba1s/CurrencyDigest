import React, { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const apiKey = process.env.REACT_APP_NEWS_API_KEY;

  const getNews = async () => {
    setIsLoading(true);
    try {
      const response = await axios
        .get(`https://newsapi.org/v2/everything?q=bitcoin&apiKey=${apiKey}`)
        .catch((err) => {
          console.log(err);
        });
      const articles = response.data.articles.slice(0, 15);
      setData(articles);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getNews();
    return () => console.log("unmounted");
  }, []);

  return (
    <>
      {loading ? (
        <h2 className="text-center">Loading...</h2>
      ) : (
        <>
          <div className="heading">Crypto Digest</div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-3 p-3">
            {data.map((news, index) => {
              return (
                <Card
                  title={news.title}
                  image={news.urlToImage}
                  author={news.author}
                  description={news.description}
                  key={index}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
