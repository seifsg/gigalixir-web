import * as api from "./api";

export interface Stats {
  id: string;
  data: {
    mem: point[];
    cpu: point[];
  };
}

export type value = number | null;
export type point = (value)[];

const get = (id: string): Promise<{ data: Stats }> => {
  return api
    .get<{ data: Stats }>(`/frontend/api/apps/${id}/stats`)
    .then((response): {
      data: Stats;
    } => {
      const { data } = response.data;
      return {
        data: {
          id,
          data
        }
      };
    });
};

export default get;
