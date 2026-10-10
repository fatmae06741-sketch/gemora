/* ============================================================
   ⚙️ الإعدادات
   ============================================================ */
const WHATSAPP_NUMBER = '201155273005';
const SHIPPING_COST = 50;
const FREE_SHIPPING_MIN = 500;

let currentLang = 'ar';

/* ============ قائمة الموبايل ============ */
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

/* ============ تبديل اللغة ============ */
const langBtn = document.getElementById('langBtn');
function switchLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  const emailIn = document.querySelector('#newsletterForm input[type="email"]');
  if (emailIn) emailIn.placeholder = (lang === 'ar') ? 'أدخل بريدك الإلكتروني' : 'Enter your email';
  if (langBtn) langBtn.textContent = (lang === 'ar') ? 'EN' : 'ع';
  document.title = (lang === 'ar') ? 'GEMORA | عالم الأحجار الكريمة' : 'GEMORA | The World of Gemstones';
  renderCart();
}
if (langBtn) {
  langBtn.addEventListener('click', () => {
    currentLang = (currentLang === 'ar') ? 'en' : 'ar';
    switchLanguage(currentLang);
  });
}

/* ============================================================
   🎯 تأثير الدايرة على العنوان
   ============================================================ */
const heroTitle = document.getElementById('heroTitle');
if (heroTitle) {
  heroTitle.addEventListener('mousemove', (e) => {
    const rect = heroTitle.getBoundingClientRect();
    heroTitle.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    heroTitle.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
  heroTitle.addEventListener('mouseenter', () => heroTitle.classList.add('hovering'));
  heroTitle.addEventListener('mouseleave', () => {
    heroTitle.classList.remove('hovering');
    heroTitle.style.setProperty('--mouse-x', '-500px');
    heroTitle.style.setProperty('--mouse-y', '-500px');
  });
}

/* ============ الإشعار ============ */
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.getElementById('toastClose');
let toastTimeout;
function showToast(title, message, duration = 3000) {
  if (!toast) return;
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}
if (toastClose) toastClose.addEventListener('click', () => toast.classList.remove('show'));

/* ============ الأكونت ============ */
const userAvatar = document.getElementById('userAvatar');
const avatarImg = document.getElementById('avatarImg');
const avatarFallback = document.getElementById('avatarFallback');
const avatarName = document.getElementById('avatarName');

function updateUserAvatar() {
  if (!userAvatar) return;
  try {
    const savedAvatar = localStorage.getItem('gemora_avatar');
    const savedName = localStorage.getItem('gemora_name');
    const savedEmail = localStorage.getItem('gemora_email');
    if (savedAvatar) {
      avatarImg.src = savedAvatar;
      avatarImg.style.display = 'block';
      avatarFallback.style.display = 'none';
    } else if (savedName || savedEmail) {
      avatarFallback.textContent = (savedName || savedEmail).charAt(0).toUpperCase();
      avatarFallback.style.display = 'flex';
      avatarImg.style.display = 'none';
    } else {
      avatarFallback.textContent = '👤';
      avatarFallback.style.display = 'flex';
      avatarImg.style.display = 'none';
    }
    avatarName.textContent = savedName ? savedName.substring(0, 12) : ((currentLang === 'ar') ? 'حسابي' : 'Account');
  } catch (err) {}
}
updateUserAvatar();

/* ============ Modal الحساب ============ */
const accountModal = document.getElementById('accountModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const accountForm = document.getElementById('accountForm');
const modalSuccess = document.getElementById('modalSuccess');
const avatarInput = document.getElementById('avatarInput');
const avatarImage = document.getElementById('avatarImage');
const avatarPlaceholder = document.getElementById('avatarPlaceholder');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
let currentAvatarData = null;

function openAccountModal() {
  try {
    const savedName = localStorage.getItem('gemora_name');
    const savedEmail = localStorage.getItem('gemora_email');
    const savedAvatar = localStorage.getItem('gemora_avatar');
    const savedPayment = localStorage.getItem('gemora_payment');
    if (savedName) nameInput.value = savedName;
    if (savedEmail) emailInput.value = savedEmail;
    if (savedAvatar) {
      currentAvatarData = savedAvatar;
      avatarImage.src = savedAvatar;
      avatarImage.classList.add('has-image');
      avatarPlaceholder.style.display = 'none';
    }
    if (savedPayment) {
      const radio = document.querySelector(`input[name="payment"][value="${savedPayment}"]`);
      if (radio) radio.checked = true;
    }
  } catch (err) {}
  accountModal.classList.add('open');
  document.body.classList.add('modal-open');
  modalSuccess.classList.remove('show');
}

function closeAccountModal() {
  accountModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

if (userAvatar) userAvatar.addEventListener('click', (e) => { e.preventDefault(); openAccountModal(); });
if (modalOverlay) modalOverlay.addEventListener('click', closeAccountModal);
if (modalClose) modalClose.addEventListener('click', closeAccountModal);

/* ============ رفع الصورة ============ */
if (avatarInput) {
  avatarInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const resizedData = await resizeImage(file, 300);
    currentAvatarData = resizedData;
    avatarImage.src = resizedData;
    avatarImage.classList.add('has-image');
    avatarPlaceholder.style.display = 'none';
  });
}

function resizeImage(file, maxSize = 300) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
        }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ============ حفظ الحساب ============ */
if (accountForm) {
  accountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (!name || !email) return;
    const paymentRadio = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : 'cash';
    try {
      localStorage.setItem('gemora_name', name);
      localStorage.setItem('gemora_email', email);
      localStorage.setItem('gemora_subscribed', 'true');
      localStorage.setItem('gemora_payment', paymentMethod);
      if (currentAvatarData) localStorage.setItem('gemora_avatar', currentAvatarData);
    } catch (err) { alert('حدثت مشكلة في الحفظ'); return; }
    updateUserAvatar();
    modalSuccess.classList.add('show');
    const paymentNames = {
      cash: { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
      visa: { ar: 'فيزا / ماستركارد', en: 'Visa / Mastercard' },
      paypal: { ar: 'باي بال', en: 'PayPal' },
      wallet: { ar: 'محفظة إلكترونية', en: 'E-Wallet' }
    };
    const payText = paymentNames[paymentMethod][currentLang];
    showToast(
      (currentLang === 'ar') ? '🎉 تم حفظ بياناتك!' : '🎉 Saved!',
      (currentLang === 'ar') ? `أهلاً ${name}! طريقة الدفع: ${payText}` : `Welcome ${name}! Payment: ${payText}`,
      3500
    );
    setTimeout(() => {
      closeAccountModal();
      modalSuccess.classList.remove('show');
    }, 1800);
  });
}

/* ============ النشرة البريدية ============ */
const newsletterForm = document.getElementById('newsletterForm');
const newsletterSection = document.querySelector('.newsletter');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailIn = newsletterForm.querySelector('input[type="email"]');
    const email = emailIn.value.trim();
    if (!email) return;
    if (newsletterSection) newsletterSection.classList.add('hidden');
    try {
      localStorage.setItem('gemora_email', email);
      localStorage.setItem('gemora_subscribed', 'true');
    } catch (err) {}
    updateUserAvatar();
    showToast((currentLang === 'ar') ? '🎉 تم الاشتراك!' : '🎉 Subscribed!', email);
    emailIn.value = '';
  });
}
try {
  if (localStorage.getItem('gemora_subscribed') === 'true' && newsletterSection) {
    newsletterSection.classList.add('hidden');
  }
} catch (err) {}

/* ============================================================
   🛒 نظام السلة
   ============================================================ */
const cartBtn = document.getElementById('cartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsBox = document.getElementById('cartItems');
const cartSubtitle = document.getElementById('cartSubtitle');
const cartTotalBox = document.getElementById('cartTotalBox');
const cartTotal = document.getElementById('cartTotal');

let cart = [];
try {
  const saved = localStorage.getItem('gemora_cart');
  if (saved) cart = JSON.parse(saved);
} catch (err) { cart = []; }

function saveCart() {
  try { localStorage.setItem('gemora_cart', JSON.stringify(cart)); } catch (err) {}
}
function getTotalCount() { return cart.reduce((sum, item) => sum + item.qty, 0); }
function getTotalPrice() { return cart.reduce((sum, item) => sum + (item.price * item.qty), 0); }
function getShipping() {
  const subtotal = getTotalPrice();
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
}
function getGrandTotal() { return getTotalPrice() + getShipping(); }

function updateBadge() {
  if (!cartBadge) return;
  const count = getTotalCount();
  cartBadge.textContent = count;
  cartBadge.style.display = count > 0 ? 'flex' : 'none';
}
function bumpCart() {
  if (!cartBtn) return;
  cartBtn.classList.remove('bump');
  void cartBtn.offsetWidth;
  cartBtn.classList.add('bump');
  setTimeout(() => cartBtn.classList.remove('bump'), 600);
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(); updateBadge(); bumpCart(); renderCart();
  const name = (currentLang === 'ar') ? product.nameAr : product.nameEn;
  showToast((currentLang === 'ar') ? '✅ تمت الإضافة!' : '✅ Added!', name, 2000);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(); updateBadge(); renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); updateBadge(); renderCart();
}

function renderCart() {
  if (!cartItemsBox) return;
  if (cart.length === 0) {
    cartItemsBox.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>${currentLang === 'ar' ? 'السلة فاضية' : 'Cart is empty'}</h3>
        <p>${currentLang === 'ar' ? 'ضيف منتجات عشان تشوفها هنا' : 'Add products to see them here'}</p>
      </div>
    `;
    if (cartTotalBox) cartTotalBox.style.display = 'none';
    if (cartSubtitle) cartSubtitle.textContent = (currentLang === 'ar') ? 'لديك 0 منتج' : 'You have 0 items';
    return;
  }
  cartItemsBox.innerHTML = cart.map(item => {
    const name = (currentLang === 'ar') ? item.nameAr : item.nameEn;
    const priceText = (currentLang === 'ar') ? `${item.price.toLocaleString('en-US')} ج.م` : `${item.price.toLocaleString('en-US')} EGP`;
    return `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${item.img}" alt=""></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-price">${priceText}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">🗑</button>
      </div>
    `;
  }).join('');
  if (cartTotalBox) {
    cartTotalBox.style.display = 'block';
    const total = getTotalPrice();
    cartTotal.textContent = (currentLang === 'ar') ? `${total.toLocaleString('en-US')} ج.م` : `${total.toLocaleString('en-US')} EGP`;
  }
  if (cartSubtitle) {
    const count = getTotalCount();
    cartSubtitle.textContent = (currentLang === 'ar') ? `لديك ${count} ${count === 1 ? 'منتج' : 'منتجات'}` : `You have ${count} ${count === 1 ? 'item' : 'items'}`;
  }
}

function openCartModal() {
  renderCart();
  cartModal.classList.add('open');
  document.body.classList.add('modal-open');
}
function closeCartModal() {
  cartModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

if (cartBtn) cartBtn.addEventListener('click', openCartModal);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartModal);
if (cartClose) cartClose.addEventListener('click', closeCartModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (cartModal && cartModal.classList.contains('open')) closeCartModal();
    if (accountModal && accountModal.classList.contains('open')) closeAccountModal();
    if (paymentModal && paymentModal.classList.contains('open')) closePaymentModal();
  }
});

/* ============================================================
   💳 نظام الدفع
   ============================================================ */
const paymentModal = document.getElementById('paymentModal');
const paymentOverlay = document.getElementById('paymentOverlay');
const paymentClose = document.getElementById('paymentClose');
const paymentForm = document.getElementById('paymentForm');
const payItemsCount = document.getElementById('payItemsCount');
const paySubtotal = document.getElementById('paySubtotal');
const payShipping = document.getElementById('payShipping');
const payTotalPrice = document.getElementById('payTotalPrice');
const payMethodName = document.getElementById('payMethodName');

const cardFields = document.getElementById('cardFields');
const paypalFields = document.getElementById('paypalFields');
const walletFields = document.getElementById('walletFields');

const cardHolder = document.getElementById('cardHolder');
const cardNumber = document.getElementById('cardNumber');
const cardExpiry = document.getElementById('cardExpiry');
const cardCvv = document.getElementById('cardCvv');
const paypalEmail = document.getElementById('paypalEmail');
const walletNumber = document.getElementById('walletNumber');

const payName = document.getElementById('payName');
const payPhone = document.getElementById('payPhone');
const payAddress = document.getElementById('payAddress');
const paySubmitBtn = document.getElementById('paySubmitBtn');

const paymentNames = {
  cash:   { ar: '💵 الدفع عند الاستلام',  en: '💵 Cash on Delivery' },
  visa:   { ar: '💳 فيزا / ماستركارد',    en: '💳 Visa / Mastercard' },
  paypal: { ar: '🅿️ باي بال',             en: '🅿️ PayPal' },
  wallet: { ar: '📱 محفظة إلكترونية',     en: '📱 E-Wallet' }
};

function openPaymentModal() {
  if (cart.length === 0) return;

  const count = getTotalCount();
  const subtotal = getTotalPrice();
  const shipping = getShipping();
  const grand = getGrandTotal();

  payItemsCount.textContent = count;
  paySubtotal.textContent = (currentLang === 'ar') ? `${subtotal.toLocaleString('en-US')} ج.م` : `${subtotal.toLocaleString('en-US')} EGP`;

  if (shipping === 0) {
    payShipping.innerHTML = (currentLang === 'ar') ? '<span class="shipping-free">🎁 مجاني</span>' : '<span class="shipping-free">🎁 FREE</span>';
  } else {
    payShipping.textContent = (currentLang === 'ar') ? `${shipping} ج.م` : `${shipping} EGP`;
  }

  payTotalPrice.textContent = (currentLang === 'ar') ? `${grand.toLocaleString('en-US')} ج.م` : `${grand.toLocaleString('en-US')} EGP`;

  const savedPayment = localStorage.getItem('gemora_payment') || 'cash';
  payMethodName.textContent = paymentNames[savedPayment][currentLang];

  cardFields.style.display = 'none';
  paypalFields.style.display = 'none';
  walletFields.style.display = 'none';

  [cardHolder, cardNumber, cardExpiry, cardCvv, paypalEmail, walletNumber].forEach(f => {
    if (f) f.required = false;
  });

  if (savedPayment === 'visa') {
    cardFields.style.display = 'block';
    cardHolder.required = true;
    cardNumber.required = true;
    cardExpiry.required = true;
    cardCvv.required = true;
  } else if (savedPayment === 'paypal') {
    paypalFields.style.display = 'block';
    paypalEmail.required = true;
  } else if (savedPayment === 'wallet') {
    walletFields.style.display = 'block';
    walletNumber.required = true;
  }

  try {
    const savedName = localStorage.getItem('gemora_name');
    if (savedName) payName.value = savedName;
  } catch (err) {}

  paymentModal.classList.add('open');
  document.body.classList.add('modal-open');
  if (cartModal) closeCartModal();
}

function closePaymentModal() {
  paymentModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

if (paymentOverlay) paymentOverlay.addEventListener('click', closePaymentModal);
if (paymentClose) paymentClose.addEventListener('click', closePaymentModal);

if (cardNumber) {
  cardNumber.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    v = v.match(/.{1,4}/g)?.join(' ') || v;
    e.target.value = v.substring(0, 19);
  });
}
if (cardExpiry) {
  cardExpiry.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    e.target.value = v;
  });
}
if (cardCvv) {
  cardCvv.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  });
}

if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = payName.value.trim();
    const phone = payPhone.value.trim();
    const address = payAddress.value.trim();
    const savedPayment = localStorage.getItem('gemora_payment') || 'cash';
    const payMethodText = paymentNames[savedPayment][currentLang];
    const subtotal = getTotalPrice();
    const shipping = getShipping();
    const grand = getGrandTotal();
    const count = getTotalCount();

    if (!name || !phone || !address) {
      showToast('⚠️ ناقص بيانات', 'من فضلك املأ كل البيانات', 2500);
      return;
    }

    if (savedPayment === 'visa') {
      const num = cardNumber.value.replace(/\s/g, '');
      if (!cardHolder.value.trim()) { showToast('⚠️ ناقص', 'أدخل الاسم على الكارت', 2500); return; }
      if (num.length < 16) { showToast('⚠️ رقم الكارت غلط', 'أدخل 16 رقم', 2500); return; }
      if (cardExpiry.value.length < 5) { showToast('⚠️ تاريخ غلط', 'مثال: 12/26', 2500); return; }
      if (cardCvv.value.length < 3) { showToast('⚠️ CVV غلط', 'أدخل 3 أرقام على الأقل', 2500); return; }
    }

    if (savedPayment === 'paypal') {
      if (!paypalEmail.value.includes('@')) { showToast('⚠️ إيميل غلط', 'أدخل إيميل باي بال صحيح', 2500); return; }
    }

    if (savedPayment === 'wallet') {
      if (walletNumber.value.length < 11) { showToast('⚠️ رقم غلط', 'أدخل رقم المحفظة كامل', 2500); return; }
    }

    paySubmitBtn.classList.add('loading');
    paySubmitBtn.disabled = true;

    const productsList = cart.map(item => {
      const itemName = (currentLang === 'ar') ? item.nameAr : item.nameEn;
      return `• ${itemName} × ${item.qty} = ${(item.price * item.qty).toLocaleString('en-US')} ج.م`;
    }).join('\n');

    let payDetails = `💳 *طريقة الدفع:* ${payMethodText}`;
    if (savedPayment === 'visa') {
      const last4 = cardNumber.value.replace(/\s/g, '').slice(-4);
      payDetails += `\n🔐 *آخر 4 أرقام:* ****${last4}`;
    } else if (savedPayment === 'paypal') {
      payDetails += `\n📧 *إيميل:* ${paypalEmail.value}`;
    } else if (savedPayment === 'wallet') {
      payDetails += `\n📱 *رقم المحفظة:* ${walletNumber.value}`;
    }

    const shippingText = shipping === 0 ? '🎁 مجاني' : `${shipping} ج.م`;

    const waMessage =
      `🛒 *أوردر جديد من GEMORA*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `👤 *الاسم:* ${name}\n` +
      `📱 *الموبايل:* ${phone}\n` +
      `📍 *العنوان:* ${address}\n` +
      `${payDetails}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `📦 *المنتجات:*\n${productsList}\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `📊 *عدد المنتجات:* ${count}\n` +
      `💰 *الإجمالي الفرعي:* ${subtotal.toLocaleString('en-US')} ج.م\n` +
      `🚚 *الشحن:* ${shippingText}\n` +
      `💵 *الإجمالي النهائي:* ${grand.toLocaleString('en-US')} ج.م\n` +
      `🕐 *التاريخ:* ${new Date().toLocaleString('ar-EG')}`;

    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    setTimeout(() => {
      paySubmitBtn.classList.remove('loading');
      paySubmitBtn.disabled = false;

      showToast(
        (currentLang === 'ar') ? '🎉 تم الدفع بنجاح!' : '🎉 Payment Successful!',
        (currentLang === 'ar')
          ? `شكراً ${name}! الإجمالي: ${grand.toLocaleString('en-US')} ج.م`
          : `Thanks ${name}! Total: ${grand.toLocaleString('en-US')} EGP`,
        4000
      );

      setTimeout(() => {
        window.open(waLink, '_blank');
        cart = [];
        saveCart();
        updateBadge();
        renderCart();
        setTimeout(() => {
          closePaymentModal();
          paymentForm.reset();
        }, 1000);
      }, 1200);
    }, 1500);
  });
}

/* ============ زرار "إتمام الشراء" ============ */
const cartCheckout = document.getElementById('cartCheckout');
if (cartCheckout) {
  cartCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('🛒 السلة فاضية', 'ضيف منتجات الأول', 2500);
      return;
    }
    const savedPayment = localStorage.getItem('gemora_payment');
    if (!savedPayment) {
      showToast('💳 حدد طريقة الدفع', 'افتح حسابك واختار طريقة الدفع الأول', 3500);
      closeCartModal();
      setTimeout(openAccountModal, 400);
      return;
    }
    openPaymentModal();
  });
}

/* ============ ربط أزرار "أضف للسلة" ============ */
document.querySelectorAll('.btn-small').forEach(button => {
  button.addEventListener('click', () => {
    addToCart({
      id: button.dataset.id,
      nameAr: button.dataset.nameAr,
      nameEn: button.dataset.nameEn,
      price: Number(button.dataset.price),
      img: button.dataset.img
    });
    const originalText = button.textContent;
    button.textContent = (currentLang === 'ar') ? 'تمت الإضافة ✓' : 'Added ✓';
    button.style.background = 'var(--gold)';
    button.style.color = 'var(--white)';
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
      button.style.color = '';
    }, 1500);
  });
});

/* ============ تشغيل أول مرة ============ */
updateBadge();
renderCart();