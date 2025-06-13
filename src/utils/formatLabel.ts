const formatLabel = (text: string): string => {
  return text === 'all' ? 'All' : text.replace(/_/g, ' ');
};

export default formatLabel;
