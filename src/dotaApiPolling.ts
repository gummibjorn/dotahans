import {InlineResponse20015, PublicMatchesApi} from "../swagger/dotaapi/api";

export class DotaApiPolling {

  constructor(private opendotaApi: PublicMatchesApi) {

  }

  fetchRecentMatches() {
    this.opendotaApi.publicMatchesGet().then(response =>{
        this.parseAPIResponse(response.body);
      }
    )
  }

  private parseAPIResponse(response: Array<InlineResponse20015>) {

  }
}
