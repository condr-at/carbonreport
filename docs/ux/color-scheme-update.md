Dark theme accent #99F0B3
Dark theme gray #101114
Dark theme background #010402

.dark, .dark-theme {
  --green-1: #010402;
  --green-2: #0d1910;
  --green-3: #0a2d17;
  --green-4: #003d1c;
  --green-5: #004b24;
  --green-6: #015b2d;
  --green-7: #026c37;
  --green-8: #008141;
  --green-9: #99f0b3;
  --green-10: #8fe6a9;
  --green-11: #69d18c;
  --green-12: #a0f7ba;

  --green-a1: #00000000;
  --green-a2: #8df8a516;
  --green-a3: #38fd822a;
  --green-a4: #00ff743a;
  --green-a5: #00fd7949;
  --green-a6: #01fd7e59;
  --green-a7: #03ff826a;
  --green-a8: #00ff817f;
  --green-a9: #a3ffbef0;
  --green-a10: #9fffbbe6;
  --green-a11: #80feabd1;
  --green-a12: #a5ffc0f7;

  --green-contrast: #112718;
  --green-surface: #192e1e80;
  --green-indicator: #99f0b3;
  --green-track: #99f0b3;
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    .dark, .dark-theme {
      --green-1: oklch(9.7% 0.0184 152.9);
      --green-2: oklch(19.7% 0.0231 152.9);
      --green-3: oklch(26.4% 0.0561 152.9);
      --green-4: oklch(31.4% 0.0828 152.9);
      --green-5: oklch(36.3% 0.0954 152.9);
      --green-6: oklch(41.2% 0.1058 152.9);
      --green-7: oklch(46.7% 0.1197 152.9);
      --green-8: oklch(52.7% 0.139 152.9);
      --green-9: oklch(88.4% 0.1196 152.9);
      --green-10: oklch(85.3% 0.1196 152.9);
      --green-11: oklch(78% 0.139 152.9);
      --green-12: oklch(90.5% 0.1196 152.9);

      --green-a1: color(display-p3 0 0 0 / 0);
      --green-a2: color(display-p3 0.6627 0.9961 0.7098 / 0.084);
      --green-a3: color(display-p3 0.451 0.9961 0.5725 / 0.16);
      --green-a4: color(display-p3 0.3569 0.9961 0.5137 / 0.224);
      --green-a5: color(display-p3 0.3882 1 0.5451 / 0.279);
      --green-a6: color(display-p3 0.4118 1 0.5569 / 0.343);
      --green-a7: color(display-p3 0.4353 1 0.5686 / 0.407);
      --green-a8: color(display-p3 0.4392 1 0.5686 / 0.491);
      --green-a9: color(display-p3 0.7255 1 0.7725 / 0.933);
      --green-a10: color(display-p3 0.7176 1 0.7647 / 0.893);
      --green-a11: color(display-p3 0.6392 1 0.7059 / 0.809);
      --green-a12: color(display-p3 0.7333 1 0.7804 / 0.961);

      --green-contrast: #112718;
      --green-surface: color(display-p3 0.1176 0.1725 0.1255 / 0.5);
      --green-indicator: oklch(88.4% 0.1196 152.9);
      --green-track: oklch(88.4% 0.1196 152.9);
    }
  }
}

.dark, .dark-theme {
  --gray-1: #030304;
  --gray-2: #151619;
  --gray-3: #1f2125;
  --gray-4: #27282e;
  --gray-5: #2e3035;
  --gray-6: #37393e;
  --gray-7: #45474c;
  --gray-8: #5e6066;
  --gray-9: #6c6e74;
  --gray-10: #797b81;
  --gray-11: #b1b3ba;
  --gray-12: #edeef1;

  --gray-a1: #ab00ac03;
  --gray-a2: #d6c4f718;
  --gray-a3: #d6d2fa24;
  --gray-a4: #d9d0fc2d;
  --gray-a5: #dedcfc34;
  --gray-a6: #e3e2fc3d;
  --gray-a7: #e8e8fe4b;
  --gray-a8: #ecedff65;
  --gray-a9: #eef0ff73;
  --gray-a10: #eff0fe81;
  --gray-a11: #f3f4feba;
  --gray-a12: #fbfcfff1;

  --gray-contrast: #FFFFFF;
  --gray-surface: rgba(0, 0, 0, 0.05);
  --gray-indicator: #6c6e74;
  --gray-track: #6c6e74;
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    .dark, .dark-theme {
      --gray-1: oklch(9.7% 0.0064 271);
      --gray-2: oklch(20% 0.0065 271);
      --gray-3: oklch(24.7% 0.0092 271);
      --gray-4: oklch(27.9% 0.0096 271);
      --gray-5: oklch(30.9% 0.0096 271);
      --gray-6: oklch(34.5% 0.0096 271);
      --gray-7: oklch(39.7% 0.0096 271);
      --gray-8: oklch(49% 0.0096 271);
      --gray-9: oklch(53.7% 0.0096 271);
      --gray-10: oklch(58.3% 0.0096 271);
      --gray-11: oklch(76.8% 0.0096 271);
      --gray-12: oklch(94.9% 0.0045 271);

      --gray-a1: color(display-p3 0.498 0 0.9882 / 0.008);
      --gray-a2: color(display-p3 0.8275 0.7922 1 / 0.091);
      --gray-a3: color(display-p3 0.8275 0.8353 0.9961 / 0.139);
      --gray-a4: color(display-p3 0.8627 0.8471 1 / 0.17);
      --gray-a5: color(display-p3 0.8627 0.8706 0.9961 / 0.202);
      --gray-a6: color(display-p3 0.8784 0.8902 0.9961 / 0.238);
      --gray-a7: color(display-p3 0.9059 0.9137 1 / 0.293);
      --gray-a8: color(display-p3 0.9294 0.9373 1 / 0.392);
      --gray-a9: color(display-p3 0.9412 0.949 1 / 0.447);
      --gray-a10: color(display-p3 0.9451 0.9529 1 / 0.499);
      --gray-a11: color(display-p3 0.9529 0.9647 0.9961 / 0.724);
      --gray-a12: color(display-p3 0.9843 0.9882 1 / 0.945);

      --gray-contrast: #FFFFFF;
      --gray-surface: color(display-p3 0 0 0 / 5%);
      --gray-indicator: oklch(53.7% 0.0096 271);
      --gray-track: oklch(53.7% 0.0096 271);
    }
  }
}

.dark, .dark-theme, :is(.dark, .dark-theme) :where(.radix-themes:not(.light, .light-theme)) {
  --color-background: #010402;
}


Light theme accent #99F0B3
Light theme gray #101114
Light theme background #010402

:root, .light, .light-theme {
  --green-1: #f7faf7;
  --green-2: #f1f7f2;
  --green-3: #daf7df;
  --green-4: #c4f2cc;
  --green-5: #afeaba;
  --green-6: #99dea7;
  --green-7: #7ecd90;
  --green-8: #53ba6f;
  --green-9: #6df393;
  --green-10: #55eb83;
  --green-11: #267c41;
  --green-12: #21442a;

  --green-a1: #fbe6ff33;
  --green-a2: #57009608;
  --green-a3: #08bb3b1e;
  --green-a4: #01c02c34;
  --green-a5: #01b72a4a;
  --green-a6: #02a92861;
  --green-a7: #0299277d;
  --green-a8: #00972ba9;
  --green-a9: #02ea468f;
  --green-a10: #00e147a7;
  --green-a11: #006421d8;
  --green-a12: #00270add;

  --green-contrast: #122717;
  --green-surface: #f0f5f1cc;
  --green-indicator: #6df393;
  --green-track: #6df393;
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root, .light, .light-theme {
      --green-1: oklch(98.2% 0.0047 150.2);
      --green-2: oklch(97.1% 0.0106 150.2);
      --green-3: oklch(94.8% 0.0439 150.2);
      --green-4: oklch(92% 0.0702 150.2);
      --green-5: oklch(88.5% 0.0894 150.2);
      --green-6: oklch(84% 0.1031 150.2);
      --green-7: oklch(78.1% 0.1169 150.2);
      --green-8: oklch(70.8% 0.1447 150.2);
      --green-9: oklch(86.7% 0.1787 150.2);
      --green-10: oklch(83.6% 0.1913 150.2);
      --green-11: oklch(52% 0.1222 150.2);
      --green-12: oklch(35.3% 0.061 150.2);

      --green-a1: color(display-p3 0.9765 0.8275 1 / 0.112);
      --green-a2: color(display-p3 0.2392 0.0196 0.4784 / 0.032);
      --green-a3: color(display-p3 0.0039 0.6392 0.1176 / 0.097);
      --green-a4: color(display-p3 0.0039 0.6863 0.0863 / 0.174);
      --green-a5: color(display-p3 0.0039 0.6353 0.0745 / 0.246);
      --green-a6: color(display-p3 0.0039 0.5765 0.0667 / 0.323);
      --green-a7: color(display-p3 0.0039 0.5176 0.0588 / 0.42);
      --green-a8: color(display-p3 0 0.498 0.0588 / 0.553);
      --green-a9: color(display-p3 0.0039 0.8588 0.1176 / 0.416);
      --green-a10: color(display-p3 0.0039 0.8078 0.102 / 0.476);
      --green-a11: color(display-p3 0 0.298 0.0431 / 0.742);
      --green-a12: color(display-p3 0 0.1137 0.0118 / 0.831);

      --green-contrast: #122717;
      --green-surface: color(display-p3 0.9412 0.9608 0.9451 / 0.8);
      --green-indicator: oklch(86.7% 0.1787 150.2);
      --green-track: oklch(86.7% 0.1787 150.2);
    }
  }
}

:root, .light, .light-theme {
  --gray-1: #f9f9f9;
  --gray-2: #f5f5f6;
  --gray-3: #ececee;
  --gray-4: #e3e4e6;
  --gray-5: #dcdddf;
  --gray-6: #d4d5d8;
  --gray-7: #c8cacd;
  --gray-8: #b5b7bb;
  --gray-9: #87888d;
  --gray-10: #7c7e82;
  --gray-11: #5e5f64;
  --gray-12: #1e1f23;

  --gray-a1: #fdf0ff66;
  --gray-a2: #ed9dff1a;
  --gray-a3: #70009813;
  --gray-a4: #4300681b;
  --gray-a5: #33005022;
  --gray-a6: #2800452a;
  --gray-a7: #19003535;
  --gray-a8: #0f002848;
  --gray-a9: #09001677;
  --gray-a10: #04001281;
  --gray-a11: #03000ea0;
  --gray-a12: #000006e0;

  --gray-contrast: #FFFFFF;
  --gray-surface: #ffffffcc;
  --gray-indicator: #87888d;
  --gray-track: #87888d;
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root, .light, .light-theme {
      --gray-1: oklch(98.1% 0.0007 271);
      --gray-2: oklch(97.1% 0.0013 271);
      --gray-3: oklch(94.4% 0.002 271);
      --gray-4: oklch(91.9% 0.0026 271);
      --gray-5: oklch(89.6% 0.0032 271);
      --gray-6: oklch(87.3% 0.0039 271);
      --gray-7: oklch(83.8% 0.0051 271);
      --gray-8: oklch(77.8% 0.007 271);
      --gray-9: oklch(62.7% 0.0074 271);
      --gray-10: oklch(59.2% 0.0075 271);
      --gray-11: oklch(48.7% 0.007 271);
      --gray-12: oklch(24.1% 0.0064 271);

      --gray-a1: color(display-p3 0.9843 0.9333 1 / 0.334);
      --gray-a2: color(display-p3 0.6824 0.0235 0.9686 / 0.04);
      --gray-a3: color(display-p3 0.3451 0.0078 0.5451 / 0.075);
      --gray-a4: color(display-p3 0.1961 0.0039 0.3765 / 0.106);
      --gray-a5: color(display-p3 0.1569 0.0078 0.2941 / 0.134);
      --gray-a6: color(display-p3 0.1176 0.0039 0.2549 / 0.165);
      --gray-a7: color(display-p3 0.0706 0.0039 0.1922 / 0.208);
      --gray-a8: color(display-p3 0.0471 0.0039 0.149 / 0.283);
      --gray-a9: color(display-p3 0.0275 0.0039 0.0863 / 0.467);
      --gray-a10: color(display-p3 0.0078 0 0.0627 / 0.506);
      --gray-a11: color(display-p3 0.0118 0 0.051 / 0.628);
      --gray-a12: color(display-p3 0 0 0.0235 / 0.88);

      --gray-contrast: #FFFFFF;
      --gray-surface: color(display-p3 1 1 1 / 80%);
      --gray-indicator: oklch(62.7% 0.0074 271);
      --gray-track: oklch(62.7% 0.0074 271);
    }
  }
}

:root, .light, .light-theme, .radix-themes {
  --color-background: #f6fff5;
}


OR

<Theme accentColor="jade" radius="large">