import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function NavBarSub() {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [activeMainNavItem, setActiveMainNavItem] = useState('');
  const [activeSubNavItem, setActiveSubNavItem] = useState('');

  const updateActiveMenuItems = (mainNavItem, subNavItem) => {
    setActiveMainNavItem(mainNavItem);
    setActiveSubNavItem(subNavItem);
    setShowSubMenu(
      mainNavItem !== 'testdata' &&
        mainNavItem !== 'btaas.ai' &&
        mainNavItem !== 'pipeline'
    );
    localStorage.setItem('activeMainNavItem', mainNavItem);
    localStorage.setItem('activeSubNavItem', subNavItem);
  };

  useEffect(() => {
    const storedActiveMainNavItem = localStorage.getItem('activeMainNavItem');
    const storedActiveSubNavItem = localStorage.getItem('activeSubNavItem');

    if (storedActiveMainNavItem !== null && storedActiveSubNavItem !== null) {
      setActiveMainNavItem(storedActiveMainNavItem);
      setActiveSubNavItem(storedActiveSubNavItem);
      setShowSubMenu(
        storedActiveMainNavItem !== 'testdata' &&
          storedActiveMainNavItem !== 'btaas.ai' &&
          storedActiveMainNavItem !== 'pipeline'
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('activeMainNavItem');
    localStorage.removeItem('activeSubNavItem');
    navigate('/');
  };

  const handleMainMenuClick = (navItem) => {
    setShowSubMenu(
      navItem !== 'testdata' && navItem !== 'btaas.ai' && navItem !== 'pipeline'
    );
    updateActiveMenuItems(navItem, '');
  };

  const handleMainNavItemClick = (navItem) => {
    setShowSubMenu(
      navItem !== 'testdata' && navItem !== 'btaas.ai' && navItem !== 'pipeline'
    );
    updateActiveMenuItems(navItem, '');
  };

  const handleSubNavItemClick = (subNavItem) => {
    setActiveSubNavItem(subNavItem);
  };

  return (
    <div>
      {user ? (
        <nav
          className={`navbar navbar-expand-lg ${
            showSubMenu ? 'bg-body-tertiary' : 'bg-transparent'
          }`}
        >
          <div className="container-fluid">
            <Link
              className="navbar-brand"
              to="/main"
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic',
                fontSize: '30px',
              }}
              onClick={() => handleMainMenuClick('btaas.ai')}
            >
              BTaaS.ai
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeMainNavItem === 'github' ? 'active' : ''
                    }`}
                    to="/githubunit"
                    style={{ fontWeight: 'bold' }}
                    onClick={() => handleMainNavItemClick('github')}
                  >
                    GitHub
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeMainNavItem === 'AzureRepoSitory' ? 'active' : ''
                    }`}
                    to="/AzureRepoSitoryunit"
                    style={{ fontWeight: 'bold' }}
                    onClick={() => handleMainNavItemClick('AzureRepoSitory')}
                  >
                    AzureDevOps
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link`}
                    to="/testdatagen"
                    style={{ fontWeight: 'bold' }}
                    onClick={() => handleMainMenuClick('testdata')}
                  >
                    TestData
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link`}
                    to="/genpipeline"
                    style={{ fontWeight: 'bold' }}
                    onClick={() => handleMainMenuClick('pipeline')}
                  >
                    Pipeline
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ml-auto offset-7">
                <li className="nav-item active">
                  <Link
                    className="nav-link active"
                    to="/"
                    style={{ fontWeight: 'bold' }}
                    onClick={handleLogout}
                  >
                    logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      ) : (
        <nav
          className={`navbar navbar-expand-lg ${
            showSubMenu ? 'bg-body-tertiary' : 'bg-transparent'
          }`}
        >
          <div className="container-fluid">
            <Link
              className="navbar-brand"
              to="/"
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic',
                fontSize: '30px',
              }}
              onClick={() => handleMainMenuClick('')}
            >
              BTaaS.ai
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto offset-11">
                <li className="nav-item active">
                  <Link
                    to="/login"
                    className="nav-link active"
                    style={{ fontWeight: 'bold' }}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      {showSubMenu && (
        <nav className="sub-menu">
          <ul className="nav nav-underline">
            {activeMainNavItem === 'github' && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeSubNavItem === 'unit' ? 'active nav-underline' : ''
                    }`}
                    to="/githubunit"
                    onClick={() => handleSubNavItemClick('unit')}
                  >
                    Unit
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeSubNavItem === 'functional'
                        ? 'active nav-underline'
                        : ''
                    }`}
                    to="/githubfunctional"
                    onClick={() => handleSubNavItemClick('functional')}
                  >
                    Functional
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeSubNavItem === 'testdata'
                        ? 'active nav-underline'
                        : ''
                    }`}
                    to="/githubtestdata"
                    onClick={() => handleSubNavItemClick('testdata')}
                  >
                    TestData
                  </Link>
                </li>
              </>
            )}
            {activeMainNavItem === 'AzureRepoSitory' && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeSubNavItem === 'unit' ? 'active nav-underline' : ''
                    }`}
                    to="/AzureRepoSitoryunit"
                    onClick={() => handleSubNavItemClick('unit')}
                  >
                    Unit
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeSubNavItem === 'functional'
                        ? 'active nav-underline'
                        : ''
                    }`}
                    to="/AzureRepoSitoryfunctional"
                    onClick={() => handleSubNavItemClick('functional')}
                  >
                    Functional
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      activeSubNavItem === 'testdata'
                        ? 'active nav-underline'
                        : ''
                    }`}
                    to="/AzureRepoSitorytestdata"
                    onClick={() => handleSubNavItemClick('testdata')}
                  >
                    TestData
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
