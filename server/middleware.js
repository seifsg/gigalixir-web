/* eslint-disable prettier/prettier */
const compose = (f1, f2) => value => f1(f2(value))

function wrapInData(body) {
    return {
        data: body
    }
}

function removeId(body) {
    const b = body
    delete b.id
    return b
}

function modifyResponseBody(res, f) {
    const oldSend = res.send
    return data => {
        const newData = JSON.stringify(f(JSON.parse(data)))
        oldSend.apply(res, [newData])
    }
}

module.exports = (req, res, next) => {
    if (req.path === '/apps') {
        const removeIds = body => body.map(removeId)
        res.send = modifyResponseBody(
            res,
            compose(
                wrapInData,
                removeIds
            )
        )
    } 
    // eslint-disable-next-line no-useless-escape
    else if (req.path.match('^.*\/apps.*\/databases.*', 'i')) {
        const removeIds = body => body.map(removeId)
        res.send = modifyResponseBody(
            res,
            compose(
                wrapInData,
                removeIds
            )
        )
    } else if (req.path.match('^/apps/[^/]+$')) {
        res.send = modifyResponseBody(
            res,
            compose(
                wrapInData,
                removeId
            )
        )
    }
    next()
}