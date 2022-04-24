export const proxied = (url: string, width?: number, height?: number) => {
    if (!width || !height) {
      return `https://images.weserv.nl/?url=${url}`;
    }
  
    return `https://images.weserv.nl/?url=${url}&w=${width}&h=${height}`;
  };