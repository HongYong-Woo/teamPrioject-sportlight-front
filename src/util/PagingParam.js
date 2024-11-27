export const createPagingParam = param => {
    const defaultPage = 1;
    const defaultSize = 10;
    const defaultTotal = 0;
    const defaultStart = 1;
    const defaultEnd = 1;
    const defaultPrev = false;
    const defaultNext = false;
    return param ? {
        'page': param.page,
        'size': param.size,
        'total': param.total,
        'start': param.start,
        'end': param.end,
        'prev': param.prev,
        'next': param.next
    }:{
        'page': defaultPage,
        'size': defaultSize,
        'total': defaultTotal,
        'start': defaultStart,
        'end': defaultEnd,
        'prev': defaultPrev,
        'next': defaultNext
    }
}


