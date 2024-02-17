const paths = {
  home() {
    return "/";
  },
  bakeryList() {
    return "/bakeries";
  },
  bakeryItem(slug: string, id: string) {
    return `/bakeries/${slug}?id=${id}`;
  },
  beverageList() {
    return "/beverages";
  },
  cakeList() {
    return "/cakes";
  },
};

export default paths;
