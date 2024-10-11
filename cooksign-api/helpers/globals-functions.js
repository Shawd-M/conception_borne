global.MergeArrayObjects = (byKey, ...lists) => Object.values(
  lists.reduce(
    (idx, list) => {
      list.forEach((record) => {
        // eslint-disable-next-line no-param-reassign
        if (idx[record[byKey]]) idx[record[byKey]] = Object.assign(idx[record[byKey]], record);
        // eslint-disable-next-line no-param-reassign
        else idx[record[byKey]] = record;
      });
      return idx;
    },
    {},
  ),
);

global.groupBy = (array, field) => array.reduce((a, e) => {
  // GROUP BY estimated key (estKey), well, may be a just plain key
  // a -- Accumulator result object
  // e -- sequentally checked Element, the Element that is tested just at this itaration

  // new grouping name may be calculated, but must be based on real value of real field
  const estKey = (e[field]);

  // eslint-disable-next-line no-param-reassign
  (a[estKey] ? a[estKey] : (a[estKey] = null || [])).push(e);
  return a;
}, {});