const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /(http:\/\/){0,1}(192|10)\.(168|223)\.\d{1,3}\.\d{1,3}:\d{2,4}/gm
      )
  );

  //? "http://192.168.7.103:5003"

  //const SERVER_URL = isLocalhost
  //  ? "http://192.168.7.104:5003"
  //  : "https://YOUR_DOMAIN/api";

  const SERVER_URL = "http://192.168.7.104:9001"

  export const STREAM_URL = `${SERVER_URL}`;


