// js/ui.js
function toggleConjugation(id) {
  const el = document.getElementById(`conjugation-${id}`) || document.getElementById(id);
  if (el) el.classList.toggle('active') || el.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Hide empty vaults
  const checkEmpty = (sectionId) => {
    const container = document.querySelector(`#${sectionId} .card-grid`);
    if (container && container.children.length === 0) {
      const sec = document.getElementById(sectionId);
      if (sec) sec.style.display = 'none';
    }
  };
  checkEmpty('verb-vault-section');
  checkEmpty('adj-vault-section');
});
