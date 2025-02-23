import axios from "axios";

export async function apiShopeeBaseInfoAndLinks({ pageNum, pageSize }: { pageNum: string | string[], pageSize: number }) {
    return axios.get("https://collshp.com/api/v3/gql/graphql", {
        params: {
            operationName: "getBaseInfoAndLinks",
            variables: {
                urlSuffix: "banhque",
                pageSize: pageSize,
                pageNum: pageNum
            },
            query: `query getBaseInfoAndLinks($urlSuffix: String!, $pageSize: String, $pageNum: String, $groupId: String, $linkNameKeyword: String) {
  landingPageBaseInfo(urlSuffix: $urlSuffix) {
    name
    headPortrait
    description
    region
    affiliateId
    shopLink
    background
    groupList {
      groupId
      groupName
      groupType
    }
    topFiveExternalLinkImages
  }
  landingPageLinkList(
    urlSuffix: $urlSuffix
    pageSize: $pageSize
    pageNum: $pageNum
    groupId: $groupId
    linkNameKeyword: $linkNameKeyword
  ) {
    totalCount
    linkList {
      linkId
      link
      linkName
      image
      linkType
      groupIds
    }
  }
}
`
        }
    });
}