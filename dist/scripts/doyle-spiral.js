"use strict";

/*   Numerics for Doyle spirals.
 *   Bryan Henderson, 2017
 */

(function () {
    var pow = Math.pow;
    var sin = Math.sin;
    var cos = Math.cos;
    var pi = Math.PI;

    function _d(z, t, p, q) {
        // The square of the distance between z*e^(it) and z*e^(it)^(p/q).
        var w = pow(z, p / q);

        var s = (p * t + 2 * pi) / q;
        return pow(z * cos(t) - w * cos(s), 2) + pow(z * sin(t) - w * sin(s), 2);
    }

    function ddz_d(z, t, p, q) {
        // The partial derivative of _d with respect to z.
        var w = pow(z, p / q);

        var s = (p * t + 2 * pi) / q;
        var ddz_w = p / q * pow(z, (p - q) / q);
        return 2 * (w * cos(s) - z * cos(t)) * (ddz_w * cos(s) - cos(t)) + 2 * (w * sin(s) - z * sin(t)) * (ddz_w * sin(s) - sin(t));
    }

    function ddt_d(z, t, p, q) {
        // The partial derivative of _d with respect to t.
        var w = pow(z, p / q);

        var s = (p * t + 2 * pi) / q;
        var dds_t = p / q;
        return 2 * (z * cos(t) - w * cos(s)) * (-z * sin(t) + w * sin(s) * dds_t) + 2 * (z * sin(t) - w * sin(s)) * (z * cos(t) - w * cos(s) * dds_t);
    }

    function _s(z, t, p, q) {
        // The square of the sum of the origin-distance of z*e^(it) and
        // the origin-distance of z*e^(it)^(p/q).
        return pow(z + pow(z, p / q), 2);
    }

    function ddz_s(z, t, p, q) {
        // The partial derivative of _s with respect to z.
        var w = pow(z, p / q);

        var ddz_w = p / q * pow(z, (p - q) / q);
        return 2 * (w + z) * (ddz_w + 1);
    }

    /*
    function ddt_s(z,t, p,q) {
        // The partial derivative of _s with respect to t.
        return 0;
    }
    */

    function _r(z, t, p, q) {
        // The square of the radius-ratio implied by having touching circles
        // centred at z*e^(it) and z*e^(it)^(p/q).
        return _d(z, t, p, q) / _s(z, t, p, q);
    }

    function ddz_r(z, t, p, q) {
        // The partial derivative of _r with respect to z.
        return (ddz_d(z, t, p, q) * _s(z, t, p, q) - _d(z, t, p, q) * ddz_s(z, t, p, q)) / pow(_s(z, t, p, q), 2);
    }

    function ddt_r(z, t, p, q) {
        // The partial derivative of _r with respect to t.
        return ddt_d(z, t, p, q) * _s(z, t, p, q)
        /* - _d(z,t,p,q) * ddt_s(z,t,p,q) */ // omitted because ddt_s is constant at zero
        / pow(_s(z, t, p, q), 2);
    }

    var epsilon = 1e-10;
    window.doyle = function (p, q) {
        // We want to find (z, t) such that:
        //    _r(z,t,0,1) = _r(z,t,p,q) = _r(pow(z, p/q), (p*t + 2*pi)/q, 0,1)
        //
        // so we define functions _f and _g to be zero when these equalities hold,
        // and use 2d Newton-Raphson to find a joint root of _f and _g.

        function _f(z, t) {
            return _r(z, t, 0, 1) - _r(z, t, p, q);
        }

        function ddz_f(z, t) {
            return ddz_r(z, t, 0, 1) - ddz_r(z, t, p, q);
        }

        function ddt_f(z, t) {
            return ddt_r(z, t, 0, 1) - ddt_r(z, t, p, q);
        }

        function _g(z, t) {
            return _r(z, t, 0, 1) - _r(pow(z, p / q), (p * t + 2 * pi) / q, 0, 1);
        }

        function ddz_g(z, t) {
            return ddz_r(z, t, 0, 1) - ddz_r(pow(z, p / q), (p * t + 2 * pi) / q, 0, 1) * (p / q) * pow(z, (p - q) / q);
        }

        function ddt_g(z, t) {
            return ddt_r(z, t, 0, 1) - ddt_r(pow(z, p / q), (p * t + 2 * pi) / q, 0, 1) * (p / q);
        }

        function find_root(z, t) {
            for (;;) {
                var v_f = _f(z, t);
                var v_g = _g(z, t);
                if (-epsilon < v_f && v_f < epsilon && -epsilon < v_g && v_g < epsilon) return { ok: true, z: z, t: t, r: Math.sqrt(_r(z, t, 0, 1)) };

                var _a = ddz_f(z, t);
                var _b = ddt_f(z, t);
                var c = ddz_g(z, t);
                var d = ddt_g(z, t);
                var det = _a * d - _b * c;
                if (-epsilon < det && det < epsilon) return { ok: false };

                z -= (d * v_f - _b * v_g) / det;
                t -= (_a * v_g - c * v_f) / det;

                if (z < epsilon) return { ok: false };
            }
        }

        var root = find_root(2, 0);
        if (!root.ok) throw "Failed to find root for p=" + p + ", q=" + q;

        var a = [root.z * cos(root.t), root.z * sin(root.t)];
        var coroot = { z: pow(root.z, p / q), t: (p * root.t + 2 * pi) / q };
        var b = [coroot.z * cos(coroot.t), coroot.z * sin(coroot.t)];
        return { a: a, b: b, r: root.r, mod_a: root.z, arg_a: root.t };
    };
})();