export const getDraft = () => {
  const draft = localStorage.getItem('billDraft');
  return draft ? JSON.parse(draft) : null;
};

export const saveDraft = (draft) => {
  localStorage.setItem('billDraft', JSON.stringify(draft));
};

export const clearDraft = () => {
  localStorage.removeItem('billDraft');
};
