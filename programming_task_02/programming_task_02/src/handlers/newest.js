class Newest {
    static handle(...sources) {
      if (!sources || sources.length === 0) return null;
  
      // Sorting the sources based on timestamp in descending order to get the most recent item
      console.log("********")
      sources.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));
      console.log(sources)
  
      // Return the first item (most recent timestamp)
      return sources[0].data;
    }
  }
  
  module.exports = Newest;
  