// global.js
// Source: https://github.com/maximakymenko/react-day-night-toggle-app/blob/master/src/global.js#L23-L41

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        align-items: center;
        background: ${({ theme }) => theme.body};
        color: ${({ theme }) => theme.text};
    }
    h1, h2, h3, h4, h5, h6 {
        color: ${({ theme }) => theme.title};
    }

    // =========================================================================
    // MATERIAL UI
    // =========================================================================
    .material-input label{
        color: ${({ theme }) => theme.input_text};
        background: linear-gradient(0deg, ${({ theme }) => theme.input_background} 6px,rgba(0,0,0,0) 0, rgba(0,0,0,0) 100%);
        padding: 0 1em 0 .25em;
    }
    .material-input input, .material-input select{
        background: ${({ theme }) => theme.input_background};
        border-radius: 4px;
        color: ${({ theme }) => theme.input_text};
    }
    .btn-primary{
        background: ${({ theme }) => theme.panel_primary_background};
        color: #ffffff;
        font-size: 17px;
    }
    .btn-primary:hover {
        background: ${({ theme }) => theme.panel_primary_background};
        color: #ffffff;
        font-size: 17px;
    }
    .btn-primary:disabled {
        color: ${({ theme }) => theme.body_background};
    }
    .btn-secondary {
        background: ${({ theme }) => theme.btnSecondary};
        font-size: 17px;
        color: white;
    }
    .btn-secondary:hover {
        background: ${({ theme }) => theme.btnSecondary};
        font-size: 17px;
        color: white;
    }

    .material-slider .MuiSlider-thumb{
        color: ${({ theme }) => theme.panel_primary_background} !important;
    }
    .material-slider .MuiSlider-rail {
        background: ${({ theme }) => theme.text};
    }
    .material-slider .MuiSlider-track {
        background: ${({ theme }) => theme.panel_primary_background};
    }

    // =========================================================================
    // GENNERAL STUFF
    // =========================================================================
    .dm-body-background  {
        background: ${({ theme }) => theme.body_background};
    }

    .dm-panel-one-background {
        background: ${({ theme }) => theme.panel_primary_background};
    }

    .dm-panel-two-background {
        background: ${({ theme }) => theme.panel_secondary_background};
    }
    .dm-panel-three-background {
        background: ${({ theme }) => theme.panel_third_background};
    }
    .dm-panel-input-background {
        background: ${({ theme }) => theme.input_background};
    }
    .dm-text-1 {
        color: ${({ theme }) => theme.text};
    }
    .dm-text-2 {
        color: ${({ theme }) => theme.text_two};
    }



  `