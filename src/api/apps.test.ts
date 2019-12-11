import axios from "axios";
import { list, create } from "./apps";

describe("list", (): void => {
  it("fetches ", (done): void => {
    const apps = [
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        unique_name: "fake-app",
        stack: "gigalixir-18",
        size: 1.0,
        replicas: 1,
        region: "v2018-us-central1",
        cloud: "gcp"
      }
    ];
    const mock = jest.spyOn(axios, "get");
    mock.mockResolvedValueOnce({ data: { data: apps } });

    const result = list();
    result
      .then((r): void => {
        expect(r.data).toStrictEqual([
          {
            id: "fake-app",
            stack: "gigalixir-18",
            size: 1.0,
            replicas: 1,
            region: "v2018-us-central1",
            cloud: "gcp"
          }
        ]);
        expect(r.total).toBe(1);
        expect(mock).toHaveBeenCalled();
      })
      .catch((reason): void => {
        done.fail(reason);
      })
      .finally((): void => {
        mock.mockRestore();
        done();
      });
  });
});

describe("create", (): void => {
  it("throws errors", (done): void => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const errors = { unique_name: ["is bad"], cloud: ["is also bad"] };
    const postMock = jest.spyOn(axios, "post");
    const getMock = jest.spyOn(axios, "get");
    getMock.mockResolvedValueOnce({ data: { data: "fake-csrf" } });
    postMock.mockRejectedValueOnce({
      response: { status: 422, data: { errors } }
    });

    const result = create("fake-name", "fake-cloud", "fake-region").finally(
      (): void => {
        expect(postMock).toHaveBeenCalled();
        expect(getMock).toHaveBeenCalled();
        getMock.mockRestore();
        postMock.mockRestore();
        done();
      }
    );
    // is this a race condition? the test finishes when done() is called
    // in the finally block above, but the rejects function below is not
    // guaranteed to be called before or after the done function? not sure.
    expect(result).rejects.toThrow("Name is bad. Cloud is also bad");
  });
});
