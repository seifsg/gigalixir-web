import axios from "axios";
import { get } from './apps'

describe('apps', () => {
    it('fetches ', (done) => {
        const apps = [{ "unique_name": "fake-app", "stack": "gigalixir-18", "size": 1.0, "replicas": 1, "region": "v2018-us-central1", "cloud": "gcp" }];
        const mock = jest.spyOn(axios, 'get')
        mock.mockResolvedValueOnce({ data: { "data": apps } })

        const result = get()
        result.then((r: { data: any }) => {
            expect(r.data.data).toStrictEqual(apps)
            expect(mock).toHaveBeenCalled()
        }).catch((reason: any) => {
            fail(reason)
        }).finally(() => {
            mock.mockRestore()
            done()
        })
    })
})