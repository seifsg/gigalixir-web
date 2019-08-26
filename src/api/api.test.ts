import axios from 'axios';
import { get } from './api';

describe('gets', () => {
    it('just gets', done => {
        const content = 'fake-content';
        const mock = jest.spyOn(axios, 'get');
        mock.mockResolvedValueOnce({ data: { data: content } });

        const result = get('/foo');
        result
            .then((r: { data: any }) => {
                expect(r.data.data).toStrictEqual(content);
                expect(mock).toHaveBeenCalled();
            })
            .catch((reason: any) => {
                fail(reason);
            })
            .finally(() => {
                mock.mockRestore();
                done();
            });
    });
});
