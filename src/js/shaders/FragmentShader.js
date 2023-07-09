const FragmentShader = `
#define PI 3.14159265359

    uniform float u_ratio;
    uniform vec2 u_cursor;
    uniform float u_stop_time;
    uniform float u_clean;
    uniform vec2 u_stop_randomizer;

    uniform sampler2D u_texture;
    varying vec2 vUv;

    // --------------------------------
    // 2D noise

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }


    float get_flower_shape(vec2 _p, float _pet_n, float _angle, float _outline) {
        _angle *= 3.;

        _p = vec2(_p.x * cos(_angle) - _p.y * sin(_angle),
        _p.x * sin(_angle) + _p.y * cos(_angle));

        float a = atan(_p.y, _p.x);

        float flower_sectoral_shape = pow(abs(sin(a * _pet_n)), .4) + .25;

        vec2 flower_size_range = vec2(.03, .1);
        float size = flower_size_range[0] + u_stop_randomizer[0] * flower_size_range[1];

        float flower_radial_shape = pow(length(_p) / size, 2.);
        flower_radial_shape -= .1 * sin(8. * a); // add noise
        flower_radial_shape = max(.1, flower_radial_shape);
        flower_radial_shape += smoothstep(0., 0.03, -_p.y + .2 * abs(_p.x));

        float grow_time = step(.25, u_stop_time) * pow(u_stop_time, .3);
        float flower_shape = 1. - smoothstep(0., flower_sectoral_shape, _outline * flower_radial_shape / grow_time);

        flower_shape *= (1. - step(1., grow_time));

        return flower_shape;
    }

    float get_stem_shape(vec2 _p, vec2 _uv, float _w, float _angle) {

        float x_offset = _p.y * sin(_angle);
        x_offset *= pow(3. * _uv.y, 2.);
        _p.x -= x_offset;

        // add horizontal noise to the cursor coordinale
        float noise_power = .5;
        float cursor_horizontal_noise = noise_power * snoise(2. * _uv * u_stop_randomizer[0]);
        cursor_horizontal_noise *= pow(dot(_p.y, _p.y), .6);// moise to be zero at cursor
        cursor_horizontal_noise *= pow(dot(_uv.y, _uv.y), .3);// moise to be zero at bottom
        _p.x += cursor_horizontal_noise;

        // vertical line through the cursor point (_p.x)
        float left = smoothstep(-_w, 0., _p.x);
        float right = 1. - smoothstep(0., _w, _p.x);
        float stem_shape = left * right;

        // make it grow + don't go up to the cursor point
        float grow_time = 1. - smoothstep(0., .2, u_stop_time);
        float stem_top_mask = smoothstep(0., pow(grow_time, .5), .03 -_p.y);
        stem_shape *= stem_top_mask;

        // stop drawing once done
        stem_shape *= (1. - step(.17, u_stop_time));

        return stem_shape;
    }

    void main() {

        vec3 base = texture2D(u_texture, vUv).xyz;

        vec2 uv = vUv;
        uv.x *= u_ratio;
        vec2 cursor = vUv - u_cursor.xy;
        cursor.x *= u_ratio;
        
        vec3 stem_color = vec3(.1 + u_stop_randomizer[0] * .6, .6, .2);
        vec3 flower_color = vec3(.6 + .5 * u_stop_randomizer[1], .1, .9 - .5 * u_stop_randomizer[1]);

        float angle = .5 * (u_stop_randomizer[0] - .5);

        float stem_shape = get_stem_shape(cursor, uv, .003, angle);
        stem_shape += get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .003, angle);
        float stem_mask = 1. - get_stem_shape(cursor, uv, .004, angle);
        stem_mask -= get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .004, angle);

        float petals_back_number = 1. + floor(u_stop_randomizer[0] * 2.);
        float angle_offset = -(2. * step(0., angle) - 1.) * .1 * u_stop_time;
        float flower_back_shape = get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.5);
        float flower_back_mask = 1. - get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.6);

        float petals_front_number = 2. + floor(u_stop_randomizer[1] * 2.);
        float flower_front_shape = get_flower_shape(cursor, petals_front_number, angle, 1.);
        float flower_front_mask = 1. - get_flower_shape(cursor, petals_front_number, angle, .95);

        vec3 color = base;
        color *= stem_mask;
        color *= flower_back_mask;
        color *= flower_front_mask;

        color += (stem_shape * stem_color);

        color += (flower_back_shape * (flower_color + vec3(0., .8 * u_stop_time, 0.)));
        color += (flower_front_shape * flower_color);

        color.r *= 1. - (.5 * flower_back_shape * flower_front_shape);
        color.b *= 1. - (flower_back_shape * flower_front_shape);


        color *= u_clean;

        gl_FragColor = vec4(color, 1.);
    }
`

export default FragmentShader;
