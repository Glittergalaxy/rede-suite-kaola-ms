/* 过滤undefined, null等无效值，可选过滤'' */
const filterEmpty = (data: any) => {
  if (data) {
    if (data instanceof Array) {
      return data;
    }
    const rst: any = {};
    Object.keys(data).forEach((key) => {
      if (key === '_allowSpace') {
        return;
      }
      if (!data[key] && data[key] !== 0 && data[key] !== false) {
        if (data._allowSpace && data[key] === '') {
          rst[key] = data[key];
        }
        return;
      }
      rst[key] = data[key];
    });
    return rst;
  }
};

const download = (url: string, params: any, isImage: boolean = true) => {
  if (!url) {
    return;
  }

  if (params) {
    url += '?';
    for (const param in params) {
      if (params.hasOwnProperty(param)) {
        if (Array.isArray(param[params])) {
          /* eslint-disable no-loop-func */
          params[param].forEach(el => url += `${param}[]=${el}&`);
          /* eslint-enable no-loop-func */
        } else if (params[param] != undefined) {
          url += `${param}=${params[param]}&`;
        }
      }
    }
  }

  if (isImage) {
    const a = document.createElement('a') as any;
    a.href = url;
    a.download = true;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
};

const blankToComma = (value: any) => {
  if (!value && value !== 0) {
    return '';
  }

  return value.trim().replace(/[ \n\t]+/g, ',')
    .replace(/[,，]+/g, ',').replace(/^[,，]/g, '')
    .replace(/[,，]$/g, '');
};

const queryAppend = (url: string, query: obj = {}) => {
  let resultUrl = url;
  Object.keys(query).forEach((key) => {
    if (query.hasOwnProperty(key) && (query[key] || query[key] === 0 || query[key] === false)) {
      resultUrl += `&${key}=${query[key]}`;
    }
  });

  resultUrl = resultUrl.replace(/&/, '?');
  return resultUrl;
};

export default {
  filterEmpty,
  download,
  blankToComma,
  queryAppend,
};
