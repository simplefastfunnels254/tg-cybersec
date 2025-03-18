document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
    const successToast = new bootstrap.Toast(document.getElementById('successToast'));
    const tagsModal = new bootstrap.Modal(document.getElementById('tagsModal'));
    const tagsContainer = document.getElementById('tagsContainer');
    const languageButton = document.getElementById('languageButton');
    const languageModal = new bootstrap.Modal(document.getElementById('languageModal'));
    const languageOptions = document.querySelectorAll('.language-option');
    const supportModal = new bootstrap.Modal(document.getElementById('supportModal'));
    const contributeBtn = document.getElementById('contributeBtn');
    
    // State variables
    let channelsData = [];
    let originalChannelsData = [];
    let searchTimeout = null;
    let currentLanguage = 'fa'; // Default language is Persian
    
    // Translations for UI elements
    const translations = {
        fa: {
            dir: 'rtl',
            languageButton: 'Language',
            languageModalTitle: 'Select Language',
            closeButton: 'بستن',
            pageTitle: 'مخزن کانال‌های تلگرام مرتبط با امنیت سایبری',
            searchPlaceholder: 'Blue, Red, OSINT, ...',
            noResults: 'هیچ نتیجه‌ای برای "{searchTerm}" یافت نشد.',
            noChannels: 'هیچ کانالی یافت نشد.',
            loadError: 'خطا در بارگذاری داده‌ها. لطفاً صفحه را مجدداً بارگذاری کنید.',
            errorTitle: 'خطا',
            successTitle: 'موفقیت',
            githubButton: 'مشاهده در گیت‌هاب',
            supportButton: 'حمایت',
            tableHeaders: {
                name: 'نام کانال',
                link: 'لینک',
                status: 'وضعیت',
                tags: 'تگ‌ها',
                description: 'توضیحات'
            },
            statusLabels: {
                active: 'فعال',
                inactive: 'غیرفعال',
                unknown: 'نامشخص'
            },
            // Support modal translations
            supportModalTitle: 'راه‌های حمایت',
            supportOptions: {
                contribute: 'مشارکت در به‌روزرسانی',
                star: 'ستاره در گیت‌هاب',
                feedback: 'ارسال بازخورد',
                // donate: 'حمایت مالی',
                sponsor: 'حمایت رسمی'
            },
            // Sponsorship modal translations
            sponsorshipModalTitle: 'حمایت رسمی',
            sponsorshipInfo: 'اگر کانال تلگرام دارید، می‌تونید با اسپانسر شدن، نام کانال خودتون رو در ردیف اول جدول و همچنین نام برندتون رو به عنوان حامی رسمی، در وبسایت در معرض نمایش قرار بدید.',
            contactMe: 'ارتباط با من'
        },
        en: {
            dir: 'ltr',
            languageButton: 'Language',
            languageModalTitle: 'Select Language',
            closeButton: 'Close',
            pageTitle: 'Telegram Cybersecurity Channels Repository',
            searchPlaceholder: 'Blue, Red, OSINT, ...',
            noResults: 'No results found for "{searchTerm}".',
            noChannels: 'No channels found.',
            loadError: 'Error loading data. Please reload the page.',
            errorTitle: 'Error',
            successTitle: 'Success',
            githubButton: 'View on GitHub',
            supportButton: 'Support',
            tableHeaders: {
                name: 'Channel Name',
                link: 'Link',
                status: 'Status',
                tags: 'Tags',
                description: 'Description'
            },
            statusLabels: {
                active: 'Active',
                inactive: 'Inactive',
                unknown: 'Unknown'
            },
            // Support modal translations
            supportModalTitle: 'Support Options',
            supportOptions: {
                contribute: 'Contribute to Updates',
                star: 'Star on GitHub',
                feedback: 'Send Feedback',
                // donate: 'Donate',
                sponsor: 'Become a Sponsor'
            },
            // Sponsorship modal translations
            sponsorshipModalTitle: 'Sponsorship Information',
            sponsorshipInfo: 'If you have a Telegram channel related to cybersecurity, you can become a sponsor to have your channel displayed at the top of the table and your brand name shown as a sponsor in the website footer.',
            contactMe: 'Contact Me'
        },
        ru: {
            dir: 'ltr',
            languageButton: 'Язык',
            languageModalTitle: 'Выбрать язык',
            closeButton: 'Закрыть',
            pageTitle: 'Репозиторий каналов Telegram по кибербезопасности',
            searchPlaceholder: 'Blue, Red, OSINT, ...',
            noResults: 'Результатов для "{searchTerm}" не найдено.',
            noChannels: 'Каналы не найдены.',
            loadError: 'Ошибка загрузки данных. Пожалуйста, перезагрузите страницу.',
            errorTitle: 'Ошибка',
            successTitle: 'Успех',
            githubButton: 'Смотреть на GitHub',
            supportButton: 'Поддержка',
            tableHeaders: {
                name: 'Название канала',
                link: 'Ссылка',
                status: 'Статус',
                tags: 'Теги',
                description: 'Описание'
            },
            statusLabels: {
                active: 'Активен',
                inactive: 'Неактивен',
                unknown: 'Неизвестно'
            },
            // Support modal translations
            supportModalTitle: 'Варианты поддержки',
            supportOptions: {
                contribute: 'Участвовать в обновлениях',
                star: 'Поставить звезду на GitHub',
                feedback: 'Отправить отзыв',
                // donate: 'Пожертвовать',
                sponsor: 'Стать спонсором'
            },
            // Sponsorship modal translations
            sponsorshipModalTitle: 'Информация о спонсорстве',
            sponsorshipInfo: 'Если у вас есть Telegram канал, связанный с кибербезопасностью, вы можете стать спонсором, чтобы ваш канал отображался в верхней части таблицы, а название вашего бренда было показано как спонсор в нижней части сайта.',
            contactMe: 'Связаться со мной'
        },
        zh: {
            dir: 'ltr',
            languageButton: '语言',
            languageModalTitle: '选择语言',
            closeButton: '关闭',
            pageTitle: 'Telegram网络安全频道库',
            searchPlaceholder: 'Blue, Red, OSINT, ...',
            noResults: '未找到"{searchTerm}"的结果。',
            noChannels: '未找到频道。',
            loadError: '加载数据错误。请重新加载页面。',
            errorTitle: '错误',
            successTitle: '成功',
            githubButton: '在GitHub上查看',
            supportButton: '支持',
            tableHeaders: {
                name: '频道名称',
                link: '链接',
                status: '状态',
                tags: '标签',
                description: '描述'
            },
            statusLabels: {
                active: '活跃',
                inactive: '不活跃',
                unknown: '未知'
            },
            // Support modal translations
            supportModalTitle: '支持选项',
            supportOptions: {
                contribute: '参与更新',
                star: '在 GitHub 上加星标',
                feedback: '发送反馈',
                // donate: '捐赠',
                sponsor: '成为赞助商'
            },
            // Sponsorship modal translations
            sponsorshipModalTitle: '赞助信息',
            sponsorshipInfo: '如果您有与网络安全相关的Telegram频道，您可以成为赞助商，让您的频道显示在表格顶部，并在网站页脚显示您的品牌名称作为赞助商。',
            contactMe: '联系我'
        }
    };
    
    // Load channels data from JSON file
    loadChannelsData();
    
    // Set up auto-refresh (every 30 seconds)
    let autoRefreshInterval = setInterval(loadChannelsData, 30000);
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    languageButton.addEventListener('click', () => languageModal.show());
    
    // Support modal event listeners
    document.querySelector('.footer-buttons a:nth-child(2)').addEventListener('click', function(e) {
        e.preventDefault();
        supportModal.show();
    });
    
    // Contribute button event listener
    contributeBtn.addEventListener('click', function() {
        supportModal.hide();
        
        // Open GitHub contribution page in a new tab
        window.open('https://github.com/mehrazino/tg-cybersec/edit/master/src/data/channels.md', '_blank');
    });
    
    // Star on GitHub button event listener
    document.querySelector('.support-option-star').addEventListener('click', function() {
        window.open('https://github.com/mehrazino/tg-cybersec', '_blank');
    });
    
    // Feedback button event listener
    document.querySelector('.support-option-feedback').addEventListener('click', function() {
        window.open('https://github.com/mehrazino/tg-cybersec/issues/new', '_blank');
    });
    
    // Temporarily disabled
    /*document.querySelector('.support-option-donate').addEventListener('click', function() {
        window.open('https://github.com/sponsors/mehrazino', '_blank');
    });*/
    
    // Sponsor button event listener
    document.querySelector('.support-option-sponsor').addEventListener('click', function() {
        supportModal.hide();
        const sponsorshipModal = new bootstrap.Modal(document.getElementById('sponsorshipModal'));
        sponsorshipModal.show();
    });
    
    // Add event listeners to language options
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            languageModal.hide();
        });
    });
    
    // Initialize language
    initLanguage();
    
    // Functions
    function initLanguage() {
        // Check if language is stored in localStorage
        const storedLang = localStorage.getItem('language');
        if (storedLang && translations[storedLang]) {
            currentLanguage = storedLang;
        }
        
        // Mark the current language as active
        updateActiveLanguage();
        
        // Apply the current language
        applyLanguage();
    }
    
    function changeLanguage(lang) {
        if (translations[lang]) {
            currentLanguage = lang;
            localStorage.setItem('language', lang);
            updateActiveLanguage();
            applyLanguage();
        }
    }
    
    function updateActiveLanguage() {
        // Remove active class from all options
        languageOptions.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === currentLanguage) {
                option.classList.add('active');
            }
        });
    }
    
    function applyLanguage() {
        const t = translations[currentLanguage];
        
        // Set document direction
        document.documentElement.setAttribute('dir', t.dir);
        document.documentElement.setAttribute('lang', currentLanguage);
        
        // Update UI text
        languageButton.innerHTML = `<i class="bi bi-globe me-1"></i> ${t.languageButton}`;
        document.getElementById('languageModalLabel').textContent = t.languageModalTitle;
        document.querySelector('#languageModal .modal-footer button').textContent = t.closeButton;
        document.querySelector('h1').textContent = t.pageTitle;
        updateSearchPlaceholder();
        
        // Update table headers
        const tableHeaders = document.querySelectorAll('thead th');
        if (tableHeaders.length >= 5) {
            tableHeaders[0].textContent = t.tableHeaders.name;
            tableHeaders[1].textContent = t.tableHeaders.link;
            tableHeaders[2].textContent = t.tableHeaders.status;
            tableHeaders[3].textContent = t.tableHeaders.tags;
            tableHeaders[4].textContent = t.tableHeaders.description;
        }
        
        // Update footer buttons
        document.querySelector('.footer-buttons a:nth-child(1)').textContent = t.githubButton;
        document.querySelector('.footer-buttons a:nth-child(2)').textContent = t.supportButton;
        
        // Update toast headers
        document.querySelector('#errorToast .toast-header strong').textContent = t.errorTitle;
        document.querySelector('#successToast .toast-header strong').textContent = t.successTitle;
        
        // Update tags modal title
        document.getElementById('tagsModalLabel').textContent = t.tableHeaders.tags;
        
        // Update support modal content
        document.getElementById('supportModalLabel').textContent = t.supportModalTitle;
        document.querySelector('.support-option-contribute').textContent = t.supportOptions.contribute;
        document.querySelector('.support-option-star').textContent = t.supportOptions.star;
        document.querySelector('.support-option-feedback').textContent = t.supportOptions.feedback;
        // Fix: Only update donate button if it exists
        const donateBtn = document.querySelector('.support-option-donate');
        if (donateBtn && t.supportOptions.donate) {
            donateBtn.textContent = t.supportOptions.donate;
        }
        // Fix: Ensure sponsor button is updated
        const sponsorBtn = document.querySelector('.support-option-sponsor');
        if (sponsorBtn && t.supportOptions.sponsor) {
            sponsorBtn.textContent = t.supportOptions.sponsor;
        }
        
        // Update sponsorship modal content
        document.getElementById('sponsorshipModalLabel').textContent = t.sponsorshipModalTitle;
        const sponsorInfo = document.querySelector('.sponsor-info');
        if (sponsorInfo) {
            sponsorInfo.textContent = t.sponsorshipInfo;
        }
        const contactBtn = document.querySelector('.sponsor-contact-btn');
        if (contactBtn) {
            contactBtn.textContent = t.contactMe;
        }
        
        // Re-render the table to update status labels
        if (channelsData.length > 0) {
            renderTable();
        }
    }
    
    function loadChannelsData() {
        fetch('src/data/channels.json?' + new Date().getTime()) // Add timestamp to prevent caching
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load channels data');
                }
                return response.json();
            })
            .then(data => {
                // Sort channels alphabetically by channel ID (link)
                channelsData = sortChannelsByLink(data);
        
                // Make a deep copy for the original data
                originalChannelsData = JSON.parse(JSON.stringify(channelsData));
                
                // Render the table
                    renderTable();
                    
                    // If there's a search term, apply the filter
                    if (searchInput.value.trim()) {
                        filterChannels(searchInput.value.trim());
                }
            })
            .catch(error => {
                console.error('Error loading data:', error);
                const t = translations[currentLanguage];
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-danger">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            ${t.loadError}
                        </td>
                    </tr>
                `;
            });
    }
    
    function renderTable() {
        const t = translations[currentLanguage];
        
        if (!channelsData || channelsData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        ${t.noChannels}
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        
        channelsData.forEach((channel, index) => {
            // Check if the text is Persian to apply RTL
            const nameDir = isPersian(channel.name) ? 'rtl' : 'ltr';
            const descDir = isPersian(channel.description) ? 'rtl' : 'ltr';
            
            tableHTML += `
                <tr>
                <td dir="${nameDir}">${escapeHtml(channel.name)}</td>
                    <td class="link-cell">${formatLink(channel.link)}</td>
                    <td>
                        <span class="status-badge status-${channel.status.toLowerCase()}">${
                            channel.status === 'Active' ? t.statusLabels.active : 
                            channel.status === 'Inactive' ? t.statusLabels.inactive : t.statusLabels.unknown
                        }</span>
                    </td>
                    <td data-channel-index="${index}">${formatTags(channel.tags, null, index)}</td>
                <td dir="${descDir}">${formatDescription(channel.description)}</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
        
        // Adding click events for 'show more tags' buttons
        const moreTagsButtons = tableBody.querySelectorAll('.more-tags[data-channel-index]');
        moreTagsButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation(); // Preventing event propagation to parent cell
                const channelIndex = parseInt(this.getAttribute('data-channel-index'));
                if (!isNaN(channelIndex) && channelIndex >= 0 && channelIndex < channelsData.length) {
                    showAllTags(channelsData[channelIndex].tags);
                }
            });
        });
    }
    
    function handleSearch() {
            clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterChannels(searchTerm);
        }, 300);
    }
    
    // Adding comma usage guidance in the search field placeholder
    function updateSearchPlaceholder() {
        const t = translations[currentLanguage];
        // If translation for search guidance exists, we use it
        if (t.searchPlaceholder) {
            searchInput.placeholder = t.searchPlaceholder;
            
            // For Persian language, we set placeholder direction to LTR
            if (currentLanguage === 'fa') {
                searchInput.setAttribute('dir', 'ltr');
            } else {
                searchInput.setAttribute('dir', t.dir);
            }
        } else {
            // Otherwise, we use the default text
            searchInput.placeholder = "Blue, Red, OSINT, ...";
            searchInput.setAttribute('dir', 'ltr');
        }
    }
    
    function filterChannels(searchTerm) {
        if (!searchTerm) {
            renderTable();
            return;
        }
        
        // Checking for comma in the search term
        const hasComma = searchTerm.includes(',');
        
        // If comma exists, we convert the term to an array of terms
        let searchTerms = [];
        if (hasComma) {
            // Splitting search term by comma and removing extra spaces
            searchTerms = searchTerm.split(',').map(term => term.trim()).filter(term => term.length > 0);
        } else {
            searchTerms = [searchTerm];
        }
        
        const filteredChannels = channelsData.filter(channel => {
            // If we have multiple search terms, all of them must match the channel
            return searchTerms.every(term => {
                const nameMatch = channel.name.toLowerCase().includes(term.toLowerCase());
                const linkMatch = channel.link.toLowerCase().includes(term.toLowerCase());
                const descriptionMatch = channel.description.toLowerCase().includes(term.toLowerCase());
                
                // Checking match with tags
                const tagsMatch = channel.tags.some(tag => 
                    tag.toLowerCase().includes(term.toLowerCase())
                );
                
                return nameMatch || linkMatch || descriptionMatch || tagsMatch;
            });
        });
        
        // Sort the filtered channels by link
        const sortedFilteredChannels = sortChannelsByLink(filteredChannels);
        
        const t = translations[currentLanguage];
        
        if (sortedFilteredChannels.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        <i class="bi bi-search me-2"></i>
                        ${t.noResults.replace('{searchTerm}', escapeHtml(searchTerm))}
                    </td>
                </tr>
            `;
            return;
        }
        
        let tableHTML = '';
        
        sortedFilteredChannels.forEach((channel, index) => {
            // For highlighting text, we need to consider all search terms
            let highlightedName = channel.name;
            let displayLink = getDisplayLink(channel.link);
            let highlightedLink = displayLink;
            let highlightedDescription = channel.description;
            
            // Highlighting all search terms
            searchTerms.forEach(term => {
                highlightedName = highlightText(highlightedName, term);
                highlightedLink = highlightText(highlightedLink, term);
                highlightedDescription = highlightText(highlightedDescription, term);
            });
            
            // Converting links in descriptions to a tags
            const descriptionWithLinks = formatDescriptionWithHighlight(channel.description, searchTerms);
            
            // Finding the main index of the channel in channelsData array
            const originalIndex = channelsData.findIndex(c => c.name === channel.name && c.link === channel.link);
            
            // Check if the text is Persian to apply RTL
            const nameDir = isPersian(channel.name) ? 'rtl' : 'ltr';
            const descDir = isPersian(channel.description) ? 'rtl' : 'ltr';
            
            tableHTML += `
                <tr>
                    <td dir="${nameDir}">${highlightedName}</td>
                    <td class="link-cell"><a href="${channel.link}" target="_blank" rel="noopener noreferrer" title="${channel.link}">${highlightedLink}</a></td>
                    <td>
                        <span class="status-badge status-${channel.status.toLowerCase()}">${
                            channel.status === 'Active' ? t.statusLabels.active : 
                            channel.status === 'Inactive' ? t.statusLabels.inactive : t.statusLabels.unknown
                        }</span>
                    </td>
                    <td>${formatTags(channel.tags, searchTerms, originalIndex)}</td>
                    <td dir="${descDir}">${descriptionWithLinks}</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
        
        // Adding click events for 'show more tags' buttons
        const moreTagsButtons = tableBody.querySelectorAll('.more-tags[data-channel-index]');
        moreTagsButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation(); // Preventing event propagation to parent cell
                const channelIndex = parseInt(this.getAttribute('data-channel-index'));
                if (!isNaN(channelIndex) && channelIndex >= 0 && channelIndex < channelsData.length) {
                    showAllTags(channelsData[channelIndex].tags);
                }
            });
        });
    }
    
    function highlightText(text, searchTerm) {
        if (!searchTerm) return escapeHtml(text);
        
        // If searchTerm is an array
        if (Array.isArray(searchTerm)) {
            let highlightedText = escapeHtml(text);
            
            // For each search term, we highlight the text
            searchTerm.forEach(term => {
                if (term) {
                    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
                    highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
                }
            });
            
            return highlightedText;
        } else {
            // Previous state for compatibility with existing code
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            return escapeHtml(text).replace(regex, '<span class="highlight">$1</span>');
        }
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function formatTags(tagsArray, searchTerm, index) {
        if (!tagsArray || tagsArray.length === 0) return '';
        
        // Removing duplicate tags using Set
        const uniqueTags = [...new Set(tagsArray)];
        
        // Number of tags to be displayed
        const maxVisibleTags = 5;
        
        // If the number of tags is more than maximum allowed
        if (uniqueTags.length > maxVisibleTags) {
            const visibleTags = uniqueTags.slice(0, maxVisibleTags);
            const remainingCount = uniqueTags.length - maxVisibleTags;
            
            let tagsHtml = visibleTags.map(tag => {
                let tagClass = 'tag';
                
                // Checking match with each search term
                let tagContent = tag;
                if (searchTerm) {
                    if (Array.isArray(searchTerm)) {
                        // Checking match with each search term
                        const matchesAnyTerm = searchTerm.some(term => 
                            term && tag.toLowerCase().includes(term.toLowerCase())
                        );
                        
                        if (matchesAnyTerm) {
                            tagContent = highlightText(tag, searchTerm);
                        } else {
                            tagContent = escapeHtml(tag);
                        }
                    } else if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
                        tagContent = highlightText(tag, searchTerm);
                    } else {
                        tagContent = escapeHtml(tag);
                    }
                } else {
                    tagContent = escapeHtml(tag);
                }
                
                return `<span class="${tagClass}">${tagContent}</span>`;
            }).join(' ');
            
            // Adding button to show more tags
            tagsHtml += ` <span class="more-tags" data-channel-index="${index}">+${remainingCount}</span>`;
            
            return tagsHtml;
        } else {
            // If the number of tags is less than or equal to maximum allowed
            return uniqueTags.map(tag => {
                let tagClass = 'tag';
                
                // Add specific classes based on tag content
                if (tag.toLowerCase().includes('blue')) {
                    tagClass += ' tag-blue';
                } else if (tag.toLowerCase().includes('red')) {
                    tagClass += ' tag-red';
                } else if (tag.toLowerCase().includes('news')) {
                    tagClass += ' tag-news';
                } else if (tag.toLowerCase().includes('academy')) {
                    tagClass += ' tag-academy';
                }
                
                // Highlight the tag if it matches the search term
                let tagContent = tag;
                if (searchTerm) {
                    if (Array.isArray(searchTerm)) {
                        // Checking match with each search term
                        const matchesAnyTerm = searchTerm.some(term => 
                            term && tag.toLowerCase().includes(term.toLowerCase())
                        );
                        
                        if (matchesAnyTerm) {
                            tagContent = highlightText(tag, searchTerm);
                        } else {
                            tagContent = escapeHtml(tag);
                        }
                    } else if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
                        tagContent = highlightText(tag, searchTerm);
                    } else {
                        tagContent = escapeHtml(tag);
                    }
                } else {
                    tagContent = escapeHtml(tag);
                }
                
                return `<span class="${tagClass}">${tagContent}</span>`;
            }).join(' ');
        }
    }
    
    function formatLink(link) {
        const displayLink = getDisplayLink(link);
        return `<a href="${link}" target="_blank" rel="noopener noreferrer" title="${link}">${escapeHtml(displayLink)}</a>`;
    }
    
    function formatDescription(description) {
        if (!description) return '';
        
        // Pattern for detecting links (http, https, ftp, and telegram links)
        const urlRegex = /(https?:\/\/[^\s]+)|(ftp:\/\/[^\s]+)|(www\.[^\s]+)|(@[a-zA-Z0-9_]{5,})|((https?:\/\/)?(t\.me\/[^\s]+))/g;
        
        // Replacing links with a tags
        const formattedText = escapeHtml(description).replace(urlRegex, function(url) {
            let href = url;
            
            // Adding http:// to links that start with www
            if (url.startsWith('www.')) {
                href = 'http://' + url;
            }
            
            // Converting telegram username to link
            if (url.startsWith('@') && url.length > 5) {
                href = 'https://t.me/' + url.substring(1);
            }
            
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="description-link">${url}</a>`;
        });
        
        return formattedText;
    }
    
    function formatDescriptionWithHighlight(description, searchTerm) {
        if (!description) return '';
        
        // First we escape the text
        let escapedText = escapeHtml(description);
        
        // Then we highlight the searched term
        if (searchTerm) {
            if (Array.isArray(searchTerm)) {
                // For each search term, we highlight the text
                searchTerm.forEach(term => {
                    if (term) {
                        const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
                        escapedText = escapedText.replace(regex, '<span class="highlight">$1</span>');
                    }
                });
            } else {
                const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
                escapedText = escapedText.replace(regex, '<span class="highlight">$1</span>');
            }
        }
        
        // Pattern for detecting links (http, https, ftp, and telegram links)
        const urlRegex = /(https?:\/\/[^\s]+)|(ftp:\/\/[^\s]+)|(www\.[^\s]+)|(@[a-zA-Z0-9_]{5,})|((https?:\/\/)?(t\.me\/[^\s]+))/g;
        
        // Replacing links with a tags
        const formattedText = escapedText.replace(urlRegex, function(url) {
            // If the link includes highlight tag, we must preserve it
            const hasHighlight = url.includes('<span class="highlight">');
            
            // If the link includes highlight tag, we shouldn't change it
            if (hasHighlight) {
                return url;
            }
            
            let href = url;
            
            // Adding http:// to links that start with www
            if (url.startsWith('www.')) {
                href = 'http://' + url;
            }
            
            // Converting telegram username to link
            if (url.startsWith('@') && url.length > 5) {
                href = 'https://t.me/' + url.substring(1);
            }
            
            return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="description-link">${url}</a>`;
        });
        
        return formattedText;
    }
    
    function getDisplayLink(link) {
        // If it's a Telegram link, format it nicely
        if (link.includes('t.me/')) {
            return '@' + link.split('t.me/')[1];
        }
        
        // If it's already a username format
        if (link.startsWith('@')) {
            return link;
        }
        
        // Otherwise, return the link as is
        return link;
    }
    
    function isPersian(text) {
        if (!text) return false;
        // Persian Unicode range (approximate)
        const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return persianRegex.test(text);
    }
    
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function showError(message) {
        const errorToastBody = document.getElementById('errorToastBody');
        errorToastBody.textContent = message;
        errorToast.show();
    }
    
    function showSuccess(message) {
        const successToastBody = document.getElementById('successToastBody');
        successToastBody.textContent = message;
        successToast.show();
    }
    
    // Function to display all tags in modal
    function showAllTags(tagsArray) {
        if (!tagsArray || tagsArray.length === 0) return;
        
        // Removing duplicate tags
        const uniqueTags = [...new Set(tagsArray)];
        
        // Creating HTML for displaying tags
        const tagsHtml = uniqueTags.map(tag => {
            let tagClass = 'tag';
            
            // Add specific classes based on tag content
            if (tag.toLowerCase().includes('blue')) {
                tagClass += ' tag-blue';
            } else if (tag.toLowerCase().includes('red')) {
                tagClass += ' tag-red';
            } else if (tag.toLowerCase().includes('news')) {
                tagClass += ' tag-news';
            } else if (tag.toLowerCase().includes('academy')) {
                tagClass += ' tag-academy';
            }
            
            return `<span class="${tagClass}">${escapeHtml(tag)}</span>`;
        }).join(' ');
        
        // Placing tags in modal
        tagsContainer.innerHTML = tagsHtml;
        
        // Showing modal
        tagsModal.show();
    }
    
    // Function to sort channels by link alphabetically
    function sortChannelsByLink(channels) {
        return [...channels].sort((a, b) => {
            // Extract the username part from the link for comparison
            const usernameA = getChannelUsername(a.link).toLowerCase();
            const usernameB = getChannelUsername(b.link).toLowerCase();
            
            return usernameA.localeCompare(usernameB);
        });
    }
    
    // Helper function to extract username from link
    function getChannelUsername(link) {
        // If it's a Telegram link, extract the username
        if (link.includes('t.me/')) {
            return link.split('t.me/')[1];
        }
        
        // If it's already a username format
        if (link.startsWith('@')) {
            return link.substring(1);
        }
        
        // Otherwise, return the link as is
        return link;
    }
}); 