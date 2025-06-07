const translations = {
    en: {
        hero: {
            title: "Save. Earn. Empower.",
            subtitle: "Join community savings circles, earn yield with RLUSD, and create impact in your community.",
            cta: "Get Started"
        },
        explainer: {
            title: "How YieldBridge Works",
            step1: {
                title: "1. Deposit RLUSD",
                desc: "Securely deposit RLUSD stablecoins to your YieldBridge wallet"
            },
            step2: {
                title: "2. Join Savings Circle",
                desc: "Connect with community members in trusted savings groups"
            },
            step3: {
                title: "3. Earn Yield",
                desc: "Generate safe returns through automated DeFi strategies"
            },
            step4: {
                title: "4. Create Impact",
                desc: "Donate portion of yield to local community causes"
            }
        },
        nav: {
            dashboard: "Dashboard",
            deposit: "Deposit",
            circles: "Circles",
            send: "Send",
            impact: "Impact"
        },
        dashboard: {
            balance: {
                title: "Your Balance"
            },
            stats: {
                yield: "Yield Earned",
                donated: "Donated",
                circle: "Circle Status",
                notJoined: "Not Joined"
            },
            actions: {
                title: "Quick Actions",
                deposit: "Deposit RLUSD",
                join: "Join Circle",
                send: "Send Money",
                impact: "Track Impact"
            }
        },
        deposit: {
            title: "Deposit RLUSD",
            currentBalance: "Current Balance",
            amount: "Amount to Deposit",
            info: {
                secure: "Secured by XRP Ledger",
                instant: "Instant confirmation",
                yield: "Earns yield automatically"
            },
            button: "Deposit RLUSD",
            success: {
                title: "Deposit Successful!",
                message: "Your RLUSD has been deposited and will start earning yield immediately.",
                continue: "Continue"
            }
        },
        circles: {
            title: "Savings Circles",
            myCircle: "My Circle",
            members: "Members",
            contribution: "Monthly",
            nextPayout: "Next Payout",
            payoutOrder: "Payout Order",
            available: "Available Circles",
            filters: {
                all: "All Amounts",
                duration: "All Durations"
            },
            join: {
                title: "Join Circle",
                terms: "By joining, you commit to monthly contributions and agree to the payout schedule.",
                cancel: "Cancel",
                confirm: "Join Circle"
            }
        },
        remittance: {
            title: "Send Money",
            available: "Available Balance",
            recipient: "Recipient Address",
            recipientHelp: "Enter XRP Ledger wallet address",
            amount: "Amount",
            memo: "Memo (Optional)",
            summary: "Transaction Summary",
            fee: "Network Fee",
            total: "Total",
            benefits: {
                fast: "Instant global transfer",
                low: "Ultra-low fees",
                secure: "Bank-grade security"
            },
            button: "Send RLUSD",
            confirm: {
                title: "Confirm Transaction",
                cancel: "Cancel",
                send: "Send Now"
            },
            success: {
                title: "Transfer Successful!",
                message: "Your RLUSD has been sent successfully.",
                done: "Done"
            }
        },
        impact: {
            title: "Impact Tracker",
            personal: {
                title: "Your Impact",
                earned: "Total Yield Earned",
                earnedSince: "Since joining",
                donated: "Total Donated",
                donatedPercent: "20% of yield",
                helped: "People Helped",
                helpedDesc: "Through your donations"
            },
            settings: {
                title: "Donation Settings",
                percentage: "Donation Percentage",
                percentageHelp: "Percentage of yield to donate",
                save: "Save Settings"
            },
            goals: {
                title: "Community Goals"
            },
            history: {
                title: "Impact History"
            }
        }
    },
    es: {
        hero: {
            title: "Ahorra. Gana. Empodera.",
            subtitle: "Únete a círculos de ahorro comunitarios, gana rendimientos con RLUSD y crea impacto en tu comunidad.",
            cta: "Comenzar"
        }
        // Additional Spanish translations would go here
    },
    fr: {
        hero: {
            title: "Épargner. Gagner. Autonomiser.",
            subtitle: "Rejoignez les cercles d'épargne communautaires, gagnez des rendements avec RLUSD et créez un impact dans votre communauté.",
            cta: "Commencer"
        }
        // Additional French translations would go here
    }
};

let currentLanguage = 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    updatePageTranslations();
}

function updatePageTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });
}

function getTranslation(key) {
    const keys = key.split('.');
    let translation = translations[currentLanguage];
    
    for (const k of keys) {
        if (translation && translation[k]) {
            translation = translation[k];
        } else {
            // Fallback to English
            translation = translations.en;
            for (const fallbackKey of keys) {
                if (translation && translation[fallbackKey]) {
                    translation = translation[fallbackKey];
                } else {
                    return key; // Return key if translation not found
                }
            }
        }
    }
    
    return translation;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    const languageSelect = document.getElementById('languageSelect');
    
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        languageSelect.addEventListener('change', function() {
            setLanguage(this.value);
        });
    }
    
    setLanguage(savedLanguage);
});
